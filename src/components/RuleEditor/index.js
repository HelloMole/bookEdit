import {
  Decoration,
  // DecorationSet,
  EditorView,
  lineNumbers,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { EditorState, StateEffect } from "@codemirror/state";
import { customSetup } from "./customSetUp";

import { javascript } from "@codemirror/lang-javascript";
import { calculate } from './calculate'
import { generateRandomData } from './generateMookData'
import {functionDescription} from "./fnData.js"

import {
  autocompletion,
  // Completion,
  // CompletionContext,
  // CompletionResult,
} from "@codemirror/autocomplete";
import { basicSetup, minimalSetup } from "codemirror";
import { effect, ref, shallowRef, watch } from "vue";

/**
 * @description 插入tag
 */
const placeholderTagMatcher = new MatchDecorator({
  regexp: /\[\[(.+?)\]\]/g,
  decoration: (match) => {
    return Decoration.replace({ widget: new PlaceholderTag(match[1]) });
  },
});
// 定义一个 PlaceholderTag 类，继承自 WidgetType
class PlaceholderTag extends WidgetType {
  // 定义一个字符串类型的 id 属性，默认值为空字符串
  id = "";
  // 定义一个字符串类型的 text 属性，默认值为空字符串
  text = "";
  // 构造函数，接收一个字符串类型的 text 参数
  constructor(text) {
    // 调用父类的构造函数
    super();
    // 被替换的数据处理
    if (text) {
      const [id, ...texts] = text.split(".");
      if (id && texts.length) {
        this.text = texts.join(".");
        this.id = id;
        // console.log(this.text, "id:", this.id);
      }
    }
  }
  eq(other) {
    return this.text == other.text;
  }
  // 此处是我们的渲染方法
  toDOM() {
    let elt = document.createElement("span");
    if (!this.text) return elt;
    elt.className = "cm-tag";
    elt.textContent = this.text;
    return elt;
  }
  ignoreEvent() {
    return true;
  }
}
// 导出一个名为placeholders的常量，它是一个ViewPlugin实例，通过fromClass方法创建
const placeholderTag = ViewPlugin.fromClass(
  // 定义一个匿名类，该类继承自ViewPlugin的基类
  class {
    // 定义一个属性placeholders，用于存储装饰集
    placeholders;
    // 构造函数，接收一个EditorView实例作为参数
    constructor(view) {
      // 调用placeholderMatcher.createDeco方法，根据传入的view创建装饰集，并赋值给placeholders属性
      this.placeholders = placeholderTagMatcher.createDeco(view);
    }
    // update方法，用于在视图更新时更新装饰集
    update(update) {
      // 调用placeholderMatcher.updateDeco方法，根据传入的update和当前的placeholders更新装饰集，并重新赋值给placeholders属性
      this.placeholders = placeholderTagMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  // 配置对象，用于定义插件的行为
  {
    // decorations属性，返回当前实例的placeholders属性，用于提供装饰集
    decorations: (v) => v.placeholders,
    // provide属性，返回一个函数，该函数返回一个EditorView.atomicRanges的提供者
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        // 从view中获取当前插件的placeholders属性，如果不存在则返回Decoration.none
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
  }
);
/**
 * @description 插入公式
 */
const placeholderFnMatcher = new MatchDecorator({
  regexp: /\{\{(.+?)\}\}/g,
  decoration: (match) => {
    return Decoration.replace({ widget: new PlaceholderFn(match[1]) });
  },
});
// 定义一个 PlaceholderFn 类，继承自 WidgetType
class PlaceholderFn extends WidgetType {
  // 定义一个字符串类型的 text 属性，默认值为空字符串
  text = "";
  // 构造函数，接收一个字符串类型的 text 参数
  constructor(text) {
    // 调用父类的构造函数
    super();
    // 被替换的数据处理
    if (text) {
      this.text = text;
    }
  }
  eq(other) {
    return this.text == other.text;
  }
  // 此处是我们的渲染方法
  toDOM() {
    let elt = document.createElement("span");
    if (!this.text) return elt;
    elt.className = "cm-fn";
    elt.textContent = this.text;
    return elt;
  }
  ignoreEvent() {
    return true;
  }
}
// 导出一个名为placeholders的常量，它是一个ViewPlugin实例，通过fromClass方法创建
const placeholderFn = ViewPlugin.fromClass(
  // 定义一个匿名类，该类继承自ViewPlugin的基类
  class {
    // 定义一个属性placeholders，用于存储装饰集
    placeholders; //DecorationSet
    // 构造函数，接收一个EditorView实例作为参数
    constructor(view) { //: EditorView
      // 调用placeholderMatcher.createDeco方法，根据传入的view创建装饰集，并赋值给placeholders属性
      this.placeholders = placeholderFnMatcher.createDeco(view);
    }
    // update方法，用于在视图更新时更新装饰集
    update(update) {  //:ViewUpdate
      // 调用placeholderMatcher.updateDeco方法，根据传入的update和当前的placeholders更新装饰集，并重新赋值给placeholders属性
      this.placeholders = placeholderFnMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  // 配置对象，用于定义插件的行为
  {
    // decorations属性，返回当前实例的placeholders属性，用于提供装饰集
    decorations: (v) => v.placeholders,
    // provide属性，返回一个函数，该函数返回一个EditorView.atomicRanges的提供者
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        // 从view中获取当前插件的placeholders属性，如果不存在则返回Decoration.none
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
  }
);

// 背景样式
export const baseTheme = EditorView.baseTheme({
  ".cm-tag": {
    paddingLeft: "6px",
    paddingRight: "6px",
    paddingTop: "3px",
    paddingBottom: "3px",
    marginLeft: "3px",
    marginRight: "3px",
    backgroundColor: "#1853AA",
    borderRadius: "4px",
    color:'#F6F5F5'
  },
  ".cm-fn": {
    color: "#01a252",
  },
});

//  const completions= [
//   {
//     label: "SUM",
//     apply: insetCompletion,
//   },
//   {
//     label: "IF",
//     apply: insetCompletion,
//   },
//   {
//     label: "MAX",
//     apply: insetCompletion,
//   },
// ];

const completions = Object.keys(functionDescription).map((item)=>{
  return {label: item, apply: insetCompletion}
})

/**
 * @description 补全提示
 * @param {CompletionContext} context
 * @return {*}
 */
function myCompletions(context) { 
  // console.log('context', context)
  // 匹配到以s或su或sum或i或if开头的单词
  // let before = context.matchBefore(/[s](?:u(?:m)?)?|[i](?:f)?/gi);
  // [a-zA-Z]
  let before = context.matchBefore(/[a-zA-Z]/);
  // console.log('before', before)
  if (!context.explicit && !before) return null;
  return {
    from: before ? before.from : context.pos,
    options: completions,
  };
}

export const useCodemirror = () => {
  const code = ref("");
  const view = shallowRef();
  const editorRef = ref();
  // const basicSetupArr = basicSetup.splice(0, 1)
  const extensions = [
    placeholderTag,
    placeholderFn,
    baseTheme,
    EditorView.lineWrapping,
    customSetup,
    // minimalSetup,
    // ...basicSetup,
    javascript(),
    
    autocompletion({ override: [myCompletions] }),
  ];
  /**
   * @description 初始化编辑器
   */
  const init = (divBody, copyCode) => {
    if (divBody) {
      // console.log('editorRef.value', editorRef.value)
      if(copyCode != null){
        code.value = copyCode
      }
      view.value = new EditorView({
        parent: divBody,
        state: EditorState.create({
          doc: code.value,
          extensions: extensions,
        }),
      });
      // console.log('EditorView', lineNumbers({lineNumbers: false}))
      // 创建一个状态效果来更改配置
      // const updateConfig = StateEffect.define()

      // view.value.dispatch({
      //   effects: [StateEffect.define({lineNumbers: false})]
      // })
      // view.value.state.setOption("lineNumbers", false);
      setTimeout(() => {
        view.value?.focus();
      }, 0);
    }
  };
  /**
   * @description 销毁编辑器
   */
  const destroyed = () => {
    view.value?.destroy();
    view.value = undefined;
  };
  /**
   * @description 插入文本并设置光标位置
   * type: "fn" | "tag" = "tag"
   */
  const insertText = (text, type) => {
    console.log('收到了insertText', text, type)
    if (view.value) {
      let content = type === "tag" ? `[[${text}]]` : `{{${text}}}()`;
      const selection = view.value.state.selection;
      if (!selection.main.empty) {
        // 如果选中文本，则替换选中文本
        const from = selection.main.from;
        const to = selection.main.to;
        const anchor =
          type === "tag" ? from + content.length : from + content.length - 1;
        const transaction = view.value.state.update({
          changes: { from, to, insert: content }, // 在当前光标位置插入标签
          selection: {
            anchor,
          }, // 指定新光标位置
        });
        view.value.dispatch(transaction);
      } else {
        // 如果没有选中文本，则插入标签
        const pos = selection.main.head;
        const anchor =
          type === "tag" ? pos + content.length : pos + content.length - 1;
        const transaction = view.value.state.update({
          changes: { from: pos, to: pos, insert: content }, // 在当前光标位置插入标签
          selection: {
            anchor: anchor,
          }, // 指定新光标位置
        });
        view.value.dispatch(transaction);
      }
      setTimeout(() => {
        view.value?.focus();
      }, 0);
    }
  };

  

  

  return {
    code,
    view,
    editorRef,
    init,
    destroyed,
    insertText,
  };
};


// 校验公式
export const validateFormula = (code, fieldList) => {
  // console.log('validateFormula',code, fieldList)
  const variable = fieldList.reduce((acc, cur) => {
    acc["[["+cur.key + "." + cur.title + "]]"] = cur.realValue != null ? cur.realValue : generateRandomData(cur.value)
    return acc
  }, {})
  // console.log('当前变量列表 variable', variable)
  const result = calculate({ text: code, marks: [], value: variable })
  // console.log('calculateResult', result)
  if(result == undefined){
    return { error: true, message: '执行结果为空' }
  }
  const calculateResult = result.toString().includes('Error: #VALUE!')
  if (calculateResult) {
    return { error: true, message: '公式计算错误，请检查公式' }
  }
  if (result.error) {
    return result
  }
  //变量查找格式 [[key.title]]
  //替换完之后仍然报错，那就是定义了非法变量
  //变量都替换成功了，计算结果出错，说明公式写错了
  return { error: false , result: result}
}

// export const functionDescription = (key) => {
//   const info = {
//     SUM: {
//       title: "求和",
//       example: "SUM(数值1,数值2,...)",
//       description: "SUM(数学成绩,语文成绩,英语成绩,...) = 各科总成绩",
//     },
//     AVERAGE: {
//       title: "平均数",
//       example: "AVERAGE(数值1,数值2,...)",
//       description: "AVERAGE(数学成绩,语文成绩,英语成绩,...) = 平均成绩",
//     },
//     IF: {
//       title: "条件判断",
//       example: "IF(条件,真值,假值)",
//       description: "IF(数学成绩>90,优秀,良好)",
//     },
//   };
//   return info[key];
// };

/**
 * @description 插入补全
 * @param {EditorView} view
 * @param {Completion} completion
 * @param {number} from
 * @param {number} to
 */
function insetCompletion(
  view,
  completion,
  from,
  to
) {
  const content = `{{${completion.label}}}()`;
  const anchor = from + content.length - 1;
  const transaction = view.state.update({
    changes: { from, to, insert: content }, // 在当前光标位置插入标签
    selection: {
      anchor: anchor,
    }, // 指定新光标位置
  });
  view.dispatch(transaction);
}

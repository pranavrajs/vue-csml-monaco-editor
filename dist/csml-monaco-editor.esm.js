/* eslint-disable vue/require-default-prop */

/**
 * Heavily inspired by https://github.com/egoist/vue-monaco/blob/master/src/MonacoEditor.js.
 * Low-level component that should NOT be modified unless you know what you're doing.
 */
var script$1 = {
  name: 'MonacoEditor',
  model: {
    event: 'change'
  },
  props: {
    original: String,
    value: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'vs'
    },
    language: String,
    options: Object,
    amdRequire: {
      type: Function
    },
    diffEditor: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    options: {
      deep: true,

      handler(options) {
        if (this.editor) {
          const editor = this.getModifiedEditor();
          editor.updateOptions(options);
        }
      }

    },

    value(newValue) {
      if (this.editor) {
        const editor = this.getModifiedEditor();

        if (newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    },

    original(newValue) {
      if (this.editor && this.diffEditor) {
        const editor = this.getOriginalEditor();

        if (newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    },

    language(newVal) {
      if (this.editor) {
        const editor = this.getModifiedEditor();
        this.monaco.editor.setModelLanguage(editor.getModel(), newVal);
      }
    },

    theme(newVal) {
      if (this.editor) {
        this.monaco.editor.setTheme(newVal);
      }
    }

  },

  mounted() {
    if (this.amdRequire) {
      this.amdRequire(['vs/editor/editor.main'], () => {
        this.monaco = window.monaco;
        this.$nextTick(() => {
          this.initMonaco(window.monaco);
        });
      });
    } else {
      // ESM format so it can't be resolved by commonjs `require` in eslint
      const monaco = require('monaco-editor');

      this.monaco = monaco;
      this.$nextTick(() => {
        this.initMonaco(monaco);
      });
    }
  },

  beforeDestroy() {
    this.editor && this.editor.dispose();
  },

  methods: {
    initMonaco(monaco) {
      this.$emit('editorWillMount', this.monaco);
      const options = { ...{
          value: this.value,
          theme: this.theme,
          language: this.language
        },
        ...this.options
      };

      if (this.diffEditor) {
        this.editor = monaco.editor.createDiffEditor(this.$el, options);
        const originalModel = monaco.editor.createModel(this.original, this.language);
        const modifiedModel = monaco.editor.createModel(this.value, this.language);
        this.editor.setModel({
          original: originalModel,
          modified: modifiedModel
        });
      } else {
        this.editor = monaco.editor.create(this.$el, options);
      } // @event `change`


      const editor = this.getModifiedEditor();
      editor.onDidChangeModelContent(event => {
        const value = editor.getValue();

        if (this.value !== value) {
          this.$emit('change', value, event);
        }
      });
      this.$emit('editorDidMount', this.editor);
    },

    getEditor() {
      return this.editor;
    },

    getModifiedEditor() {
      return this.diffEditor ? this.editor.getModifiedEditor() : this.editor;
    },

    getOriginalEditor() {
      return this.diffEditor ? this.editor.getOriginalEditor() : this.editor;
    },

    focus() {
      this.editor.focus();
    }

  },

  render(h) {
    return h('div');
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__$1 = script$1;
/* template */

/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

var MonacoEditor = __vue_component__$2;

var defaultOptions = {
  automaticLayout: true,
  fixedOverflowWidgets: true,
  fontSize: 14,
  minimap: {
    enabled: false
  },
  scrollbar: {
    horizontalScrollbarSize: 10,
    verticalScrollbarSize: 10
  },
  tabSize: 2
};

/* eslint-disable no-useless-escape */
const csmlKeywords = ['as', 'break', 'const', 'debug', 'do', 'event', 'flow', 'fn', 'foreach', 'forget', 'goto', 'hold', 'hold_secure', 'in', 'import', 'remember', 'say', 'step', // deprecated
'use'];
var csmlMonarchTokens = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',
  keywords: ['abstract', 'continue', 'for', 'new', 'switch', 'assert', 'goto', 'do', 'if', 'private', 'this', 'break', 'protected', 'throw', 'else', 'public', 'enum', 'return', 'catch', 'try', 'interface', 'static', 'class', 'finally', 'const', 'super', 'while', 'true', 'false', ...csmlKeywords],
  typeKeywords: ['boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'],
  operators: ['=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=', '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%', '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=', '%=', '<<=', '>>=', '>>>='],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // The main tokenizer for CSML
  tokenizer: {
    root: [// identifiers and keywords
    [/[a-z_][\w$]*/, {
      cases: {
        '@typeKeywords': 'keyword',
        '@keywords': 'keyword',
        '@default': 'identifier'
      }
    }], [/[A-Z][\w\$]*/, 'type.identifier'], // to show class names nicely
    // whitespace
    {
      include: '@whitespace'
    }, // delimiters and operators
    [/[{}()\[\]]/, '@brackets'], [/[<>](?!@symbols)/, '@brackets'], [/@symbols/, {
      cases: {
        '@operators': 'operator',
        '@default': ''
      }
    }], // @ annotations
    [/@/, 'annotation'], // $ variables
    [/[$a-zA-Z_]\w*/, 'variable'], // numbers
    [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'], [/0[xX][0-9a-fA-F]+/, 'number.hex'], [/\d+/, 'number'], // delimiter: after number because of .\d floats
    [/[;,.]/, 'delimiter'], // strings
    [/"/, {
      token: 'string.quote',
      bracket: '@open',
      next: '@string'
    }], // characters
    [/'[^\\']'/, 'string'], [/(')(@escapes)(')/, ['string', 'string.escape', 'string']], [/'/, 'string.invalid']],
    comment: [[/[^\/*]+/, 'comment'], [/\/\*/, 'comment', '@push'], // nested comment
    ['\\*/', 'comment', '@pop'], [/[\/*]/, 'comment']],
    string: [[/[^\\"]+/, 'string'], [/@escapes/, 'string.escape'], [/\\./, 'string.escape.invalid'], [/"/, {
      token: 'string.quote',
      bracket: '@close',
      next: '@pop'
    }]],
    whitespace: [[/[ \t\r\n]+/, 'white'], [/\/\*/, 'comment', '@comment'], [/\/\/.*$/, 'comment']]
  }
};

const monaco$2 = require('monaco-editor');

const macros = ['App', 'Audio', 'Base64', 'Card', 'Carousel', 'Crypto', 'Exists', 'Find', 'Floor', 'Hex', 'HTTP', 'Image', 'JWT', 'Length', 'Object', 'OneOf', 'Or', 'Question', 'Random', 'Shuffle', 'SMTP', 'Text', 'Time', 'Typing', 'Url', 'UUID', 'Video', 'Wait', // Studio components
'Calendar', 'Input', 'LaTeX', 'Multiselect', 'QuickReply'].map(macro => {
  return {
    label: macro,
    kind: monaco$2.languages.CompletionItemKind.Snippet,
    insertText: macro + '(${1:parameters})',
    insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: `${macro} Statement`
  };
});
const keywords = [{
  label: 'say',
  kind: monaco$2.languages.CompletionItemKind.Keyword,
  insertText: 'say "$0"',
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet
}, {
  label: 'goto',
  kind: monaco$2.languages.CompletionItemKind.Keyword,
  insertText: 'goto $0',
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet
}, {
  label: 'remember',
  kind: monaco$2.languages.CompletionItemKind.Keyword,
  insertText: 'remember $1 = $0',
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet
}, {
  label: 'forget',
  kind: monaco$2.languages.CompletionItemKind.Keyword,
  insertText: 'forget $0',
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet
}];
const structures = [{
  label: 'if',
  kind: monaco$2.languages.CompletionItemKind.Snippet,
  insertText: ['if (${1:condition}) {', '\t$0', '}'].join('\n'),
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'If Statement'
}, {
  label: 'ifelse',
  kind: monaco$2.languages.CompletionItemKind.Snippet,
  insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'If-Else Statement'
}, {
  label: 'foreach',
  kind: monaco$2.languages.CompletionItemKind.Snippet,
  insertText: ['foreach (${1:item}) in ${2:items} {', '\t$0', '}'].join('\n'),
  insertTextRules: monaco$2.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'For-Each Statement'
}];
const csmlCompletion = [...macros, ...keywords, ...structures];
/**
 * Provide completion items for the given position and document.
 * @see {@link https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitemprovider.html}
 *
 * @param {*} model A model.
 * @param {*} position A position in the editor.
 * @returns ProviderResult<CompletionList>
 */

function csmlProvideCompletionItems(model, position) {
  const wordBeforePosition = model.getWordUntilPosition({
    lineNumber: position.lineNumber,
    column: position.column - 1
  });
  const wordUntilPosition = model.getWordUntilPosition(position); // Little "hack" to trigger the custom completions but still keeping the default completion.
  // See: https://github.com/microsoft/monaco-editor/issues/1850#issuecomment-753648781

  if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
    const keywords = csmlCompletion;
    const suggestions = keywords.map(id => ({
      label: id.label,
      kind: id.kind,
      description: id.description,
      documentation: id.description,
      insertText: id.insertText,
      detail: id.description,
      insertTextRules: id.insertTextRules,
      range: {
        startLineNumber: position.lineNumber,
        startColumn: wordUntilPosition.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: wordUntilPosition.endColumn - 1
      }
    }));
    return {
      suggestions
    };
  }
}

var csmlCompletionItemProvider = {
  provideCompletionItems: csmlProvideCompletionItems
};

/* eslint-disable no-useless-escape */
const monaco$1 = require('monaco-editor');

var csmlLanguageConfiguration = {
  // the default separators except `@$`
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  onEnterRules: [{
    // e.g. /** | */
    beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
    afterText: /^\s*\*\/$/,
    action: {
      indentAction: monaco$1.languages.IndentAction.IndentOutdent,
      appendText: ' * '
    }
  }, {
    // e.g. /** ...|
    beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
    action: {
      indentAction: monaco$1.languages.IndentAction.None,
      appendText: ' * '
    }
  }, {
    // e.g.  * ...|
    beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
    action: {
      indentAction: monaco$1.languages.IndentAction.None,
      appendText: '* '
    }
  }, {
    // e.g.  */|
    beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
    action: {
      indentAction: monaco$1.languages.IndentAction.None,
      removeText: 1
    }
  }],
  autoClosingPairs: [{
    open: '{',
    close: '}'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '"',
    close: '"',
    notIn: ['string']
  }, {
    open: '\'',
    close: '\'',
    notIn: ['string', 'comment']
  }, {
    open: '`',
    close: '`',
    notIn: ['string', 'comment']
  }, {
    open: '/**',
    close: ' */',
    notIn: ['string']
  }],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*#?region\\b'),
      end: new RegExp('^\\s*//\\s*#?endregion\\b')
    }
  }
};

var base = "vs-dark";
var inherit = true;
var rules = [
	{
		background: "011627",
		token: ""
	},
	{
		foreground: "637777",
		token: "comment"
	},
	{
		foreground: "addb67",
		token: "string"
	},
	{
		foreground: "ecc48d",
		token: "vstring.quoted"
	},
	{
		foreground: "ecc48d",
		token: "variable.other.readwrite.js"
	},
	{
		foreground: "5ca7e4",
		token: "string.regexp"
	},
	{
		foreground: "5ca7e4",
		token: "string.regexp keyword.other"
	},
	{
		foreground: "5f7e97",
		token: "meta.function punctuation.separator.comma"
	},
	{
		foreground: "f78c6c",
		token: "constant.numeric"
	},
	{
		foreground: "f78c6c",
		token: "constant.character.numeric"
	},
	{
		foreground: "addb67",
		token: "variable"
	},
	{
		foreground: "c792ea",
		token: "keyword"
	},
	{
		foreground: "c792ea",
		token: "punctuation.accessor"
	},
	{
		foreground: "c792ea",
		token: "storage"
	},
	{
		foreground: "c792ea",
		token: "meta.var.expr"
	},
	{
		foreground: "c792ea",
		token: "meta.class meta.method.declaration meta.var.expr storage.type.jsm"
	},
	{
		foreground: "c792ea",
		token: "storage.type.property.js"
	},
	{
		foreground: "c792ea",
		token: "storage.type.property.ts"
	},
	{
		foreground: "c792ea",
		token: "storage.type.property.tsx"
	},
	{
		foreground: "82aaff",
		token: "storage.type"
	},
	{
		foreground: "ffcb8b",
		token: "entity.name.class"
	},
	{
		foreground: "ffcb8b",
		token: "meta.class entity.name.type.class"
	},
	{
		foreground: "addb67",
		token: "entity.other.inherited-class"
	},
	{
		foreground: "82aaff",
		token: "entity.name.function"
	},
	{
		foreground: "addb67",
		token: "punctuation.definition.variable"
	},
	{
		foreground: "d3423e",
		token: "punctuation.section.embedded"
	},
	{
		foreground: "d6deeb",
		token: "punctuation.terminator.expression"
	},
	{
		foreground: "d6deeb",
		token: "punctuation.definition.arguments"
	},
	{
		foreground: "d6deeb",
		token: "punctuation.definition.array"
	},
	{
		foreground: "d6deeb",
		token: "punctuation.section.array"
	},
	{
		foreground: "d6deeb",
		token: "meta.array"
	},
	{
		foreground: "d9f5dd",
		token: "punctuation.definition.list.begin"
	},
	{
		foreground: "d9f5dd",
		token: "punctuation.definition.list.end"
	},
	{
		foreground: "d9f5dd",
		token: "punctuation.separator.arguments"
	},
	{
		foreground: "d9f5dd",
		token: "punctuation.definition.list"
	},
	{
		foreground: "d3423e",
		token: "string.template meta.template.expression"
	},
	{
		foreground: "d6deeb",
		token: "string.template punctuation.definition.string"
	},
	{
		foreground: "c792ea",
		fontStyle: "italic",
		token: "italic"
	},
	{
		foreground: "addb67",
		fontStyle: "bold",
		token: "bold"
	},
	{
		foreground: "82aaff",
		token: "constant.language"
	},
	{
		foreground: "82aaff",
		token: "punctuation.definition.constant"
	},
	{
		foreground: "82aaff",
		token: "variable.other.constant"
	},
	{
		foreground: "7fdbca",
		token: "support.function.construct"
	},
	{
		foreground: "7fdbca",
		token: "keyword.other.new"
	},
	{
		foreground: "82aaff",
		token: "constant.character"
	},
	{
		foreground: "82aaff",
		token: "constant.other"
	},
	{
		foreground: "f78c6c",
		token: "constant.character.escape"
	},
	{
		foreground: "addb67",
		token: "entity.other.inherited-class"
	},
	{
		foreground: "d7dbe0",
		token: "variable.parameter"
	},
	{
		foreground: "7fdbca",
		token: "entity.name.tag"
	},
	{
		foreground: "cc2996",
		token: "punctuation.definition.tag.html"
	},
	{
		foreground: "cc2996",
		token: "punctuation.definition.tag.begin"
	},
	{
		foreground: "cc2996",
		token: "punctuation.definition.tag.end"
	},
	{
		foreground: "addb67",
		token: "entity.other.attribute-name"
	},
	{
		foreground: "addb67",
		token: "entity.name.tag.custom"
	},
	{
		foreground: "82aaff",
		token: "support.function"
	},
	{
		foreground: "82aaff",
		token: "support.constant"
	},
	{
		foreground: "7fdbca",
		token: "upport.constant.meta.property-value"
	},
	{
		foreground: "addb67",
		token: "support.type"
	},
	{
		foreground: "addb67",
		token: "support.class"
	},
	{
		foreground: "addb67",
		token: "support.variable.dom"
	},
	{
		foreground: "7fdbca",
		token: "support.constant"
	},
	{
		foreground: "7fdbca",
		token: "keyword.other.special-method"
	},
	{
		foreground: "7fdbca",
		token: "keyword.other.new"
	},
	{
		foreground: "7fdbca",
		token: "keyword.other.debugger"
	},
	{
		foreground: "7fdbca",
		token: "keyword.control"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.comparison"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.flow.js"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.flow.ts"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.flow.tsx"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.ruby"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.module.ruby"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.class.ruby"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.def.ruby"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.loop.js"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.loop.ts"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.import.js"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.import.ts"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.import.tsx"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.from.js"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.from.ts"
	},
	{
		foreground: "c792ea",
		token: "keyword.control.from.tsx"
	},
	{
		foreground: "ffffff",
		background: "ff2c83",
		token: "invalid"
	},
	{
		foreground: "ffffff",
		background: "d3423e",
		token: "invalid.deprecated"
	},
	{
		foreground: "7fdbca",
		token: "keyword.operator"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.relational"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.assignement"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.arithmetic"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.bitwise"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.increment"
	},
	{
		foreground: "c792ea",
		token: "keyword.operator.ternary"
	},
	{
		foreground: "637777",
		token: "comment.line.double-slash"
	},
	{
		foreground: "cdebf7",
		token: "object"
	},
	{
		foreground: "ff5874",
		token: "constant.language.null"
	},
	{
		foreground: "d6deeb",
		token: "meta.brace"
	},
	{
		foreground: "c792ea",
		token: "meta.delimiter.period"
	},
	{
		foreground: "d9f5dd",
		token: "punctuation.definition.string"
	},
	{
		foreground: "ff5874",
		token: "constant.language.boolean"
	},
	{
		foreground: "ffffff",
		token: "object.comma"
	},
	{
		foreground: "7fdbca",
		token: "variable.parameter.function"
	},
	{
		foreground: "80cbc4",
		token: "support.type.vendor.property-name"
	},
	{
		foreground: "80cbc4",
		token: "support.constant.vendor.property-value"
	},
	{
		foreground: "80cbc4",
		token: "support.type.property-name"
	},
	{
		foreground: "80cbc4",
		token: "meta.property-list entity.name.tag"
	},
	{
		foreground: "57eaf1",
		token: "meta.property-list entity.name.tag.reference"
	},
	{
		foreground: "f78c6c",
		token: "constant.other.color.rgb-value punctuation.definition.constant"
	},
	{
		foreground: "ffeb95",
		token: "constant.other.color"
	},
	{
		foreground: "ffeb95",
		token: "keyword.other.unit"
	},
	{
		foreground: "c792ea",
		token: "meta.selector"
	},
	{
		foreground: "fad430",
		token: "entity.other.attribute-name.id"
	},
	{
		foreground: "80cbc4",
		token: "meta.property-name"
	},
	{
		foreground: "c792ea",
		token: "entity.name.tag.doctype"
	},
	{
		foreground: "c792ea",
		token: "meta.tag.sgml.doctype"
	},
	{
		foreground: "d9f5dd",
		token: "punctuation.definition.parameters"
	},
	{
		foreground: "ecc48d",
		token: "string.quoted"
	},
	{
		foreground: "ecc48d",
		token: "string.quoted.double"
	},
	{
		foreground: "ecc48d",
		token: "string.quoted.single"
	},
	{
		foreground: "addb67",
		token: "support.constant.math"
	},
	{
		foreground: "addb67",
		token: "support.type.property-name.json"
	},
	{
		foreground: "addb67",
		token: "support.constant.json"
	},
	{
		foreground: "c789d6",
		token: "meta.structure.dictionary.value.json string.quoted.double"
	},
	{
		foreground: "80cbc4",
		token: "string.quoted.double.json punctuation.definition.string.json"
	},
	{
		foreground: "ff5874",
		token: "meta.structure.dictionary.json meta.structure.dictionary.value constant.language"
	},
	{
		foreground: "d6deeb",
		token: "variable.other.ruby"
	},
	{
		foreground: "ecc48d",
		token: "entity.name.type.class.ruby"
	},
	{
		foreground: "ecc48d",
		token: "keyword.control.class.ruby"
	},
	{
		foreground: "ecc48d",
		token: "meta.class.ruby"
	},
	{
		foreground: "7fdbca",
		token: "constant.language.symbol.hashkey.ruby"
	},
	{
		foreground: "e0eddd",
		background: "a57706",
		fontStyle: "italic",
		token: "meta.diff"
	},
	{
		foreground: "e0eddd",
		background: "a57706",
		fontStyle: "italic",
		token: "meta.diff.header"
	},
	{
		foreground: "ef535090",
		fontStyle: "italic",
		token: "markup.deleted"
	},
	{
		foreground: "a2bffc",
		fontStyle: "italic",
		token: "markup.changed"
	},
	{
		foreground: "a2bffc",
		fontStyle: "italic",
		token: "meta.diff.header.git"
	},
	{
		foreground: "a2bffc",
		fontStyle: "italic",
		token: "meta.diff.header.from-file"
	},
	{
		foreground: "a2bffc",
		fontStyle: "italic",
		token: "meta.diff.header.to-file"
	},
	{
		foreground: "219186",
		background: "eae3ca",
		token: "markup.inserted"
	},
	{
		foreground: "d3201f",
		token: "other.package.exclude"
	},
	{
		foreground: "d3201f",
		token: "other.remove"
	},
	{
		foreground: "269186",
		token: "other.add"
	},
	{
		foreground: "ff5874",
		token: "constant.language.python"
	},
	{
		foreground: "82aaff",
		token: "variable.parameter.function.python"
	},
	{
		foreground: "82aaff",
		token: "meta.function-call.arguments.python"
	},
	{
		foreground: "b2ccd6",
		token: "meta.function-call.python"
	},
	{
		foreground: "b2ccd6",
		token: "meta.function-call.generic.python"
	},
	{
		foreground: "d6deeb",
		token: "punctuation.python"
	},
	{
		foreground: "addb67",
		token: "entity.name.function.decorator.python"
	},
	{
		foreground: "8eace3",
		token: "source.python variable.language.special"
	},
	{
		foreground: "82b1ff",
		token: "markup.heading.markdown"
	},
	{
		foreground: "c792ea",
		fontStyle: "italic",
		token: "markup.italic.markdown"
	},
	{
		foreground: "addb67",
		fontStyle: "bold",
		token: "markup.bold.markdown"
	},
	{
		foreground: "697098",
		token: "markup.quote.markdown"
	},
	{
		foreground: "80cbc4",
		token: "markup.inline.raw.markdown"
	},
	{
		foreground: "ff869a",
		token: "markup.underline.link.markdown"
	},
	{
		foreground: "ff869a",
		token: "markup.underline.link.image.markdown"
	},
	{
		foreground: "d6deeb",
		token: "string.other.link.title.markdown"
	},
	{
		foreground: "d6deeb",
		token: "string.other.link.description.markdown"
	},
	{
		foreground: "82b1ff",
		token: "punctuation.definition.string.markdown"
	},
	{
		foreground: "82b1ff",
		token: "punctuation.definition.string.begin.markdown"
	},
	{
		foreground: "82b1ff",
		token: "punctuation.definition.string.end.markdown"
	},
	{
		foreground: "82b1ff",
		token: "meta.link.inline.markdown punctuation.definition.string"
	},
	{
		foreground: "7fdbca",
		token: "punctuation.definition.metadata.markdown"
	},
	{
		foreground: "82b1ff",
		token: "beginning.punctuation.definition.list.markdown"
	}
];
var colors = {
	"editor.foreground": "#d6deeb",
	"editor.background": "#011627",
	"editor.selectionBackground": "#5f7e9779",
	"editor.lineHighlightBackground": "#010E17",
	"editorCursor.foreground": "#80a4c2",
	"editorWhitespace.foreground": "#2e2040",
	"editorIndentGuide.background": "#5e81ce52",
	"editor.selectionHighlightBorder": "#122d42"
};
var nightOwl = {
	base: base,
	inherit: inherit,
	rules: rules,
	colors: colors
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const monaco = require('monaco-editor');
/**
 * A Monaco editor component with CSML support and a default opiniated configuration.
 *
 * @vue-prop {String} value - The editor's content.
 * @vue-prop {String} [theme='vs-dark'] - The theme of the editor.
 * @vue-data {Object} monaco - The monaco instance.
 * @vue-data {Object} editor - The editor instance.
 * @vue-event {Object} editorWillMount - Emit monaco instance before mount.
 * @vue-event {Object} editorDidMount - Emit editor instance after mount.
 * @vue-event save - Emit a save event.
 */

var script = {
  name: 'CsmlMonacoEditor',
  components: {
    MonacoEditor
  },
  props: {
    value: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'night-owl'
    },
    language: {
      type: String,
      default: 'csml'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      monaco: null,
      editor: null,
      isMounted: false
    };
  },

  computed: {
    customOptions() {
      return { ...defaultOptions,
        ...this.options
      };
    }

  },

  mounted() {
    // Register the CSML language
    monaco.languages.register({
      id: 'csml'
    });
    monaco.languages.onLanguage('csml', this.setupCsmlSupport); // Define the Night Owl theme

    monaco.editor.defineTheme('night-owl', nightOwl);
    this.isMounted = true;
  },

  methods: {
    onEditorWillMount(monaco) {
      this.monaco = monaco;
      this.$emit('editorWillMount', this.monaco);
    },

    onEditorDidMount(editor) {
      this.editor = editor;
      this.setupCommands(editor);
      this.$emit('editorDidMount', this.editor);
    },

    setupCsmlSupport() {
      monaco.languages.setMonarchTokensProvider('csml', csmlMonarchTokens);
      monaco.languages.setLanguageConfiguration('csml', csmlLanguageConfiguration);
      monaco.languages.registerCompletionItemProvider('csml', csmlCompletionItemProvider);
    },

    setupCommands(editor) {
      // Ctrl + S: save
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => this.$emit('save')); // Ctrl + Shift + /: line comment

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.US_SLASH, () => editor.getAction('editor.action.commentLine').run());
    },

    onChange(value) {
      this.$emit('input', value);
    }

  }
};

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "c-csml-monaco-editor"
  }, [_vm.isMounted ? _c('MonacoEditor', {
    staticClass: "c-monaco-editor",
    attrs: {
      "value": _vm.value,
      "theme": _vm.theme,
      "language": _vm.language,
      "options": _vm.customOptions
    },
    on: {
      "editorWillMount": _vm.onEditorWillMount,
      "editorDidMount": _vm.onEditorDidMount,
      "change": _vm.onChange
    }
  }) : _vm._e()], 1);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-12c61e5e_0", {
    source: ".c-csml-monaco-editor[data-v-12c61e5e]{position:relative}.c-monaco-editor[data-v-12c61e5e]{position:absolute;top:0;right:0;bottom:0;left:0}.c-monaco-editor[data-v-12c61e5e] :focus{outline:1px solid #007fd4}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-12c61e5e";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

var __vue_component__$1 = __vue_component__;

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MonacoEditor: MonacoEditor,
  CsmlMonacoEditor: __vue_component__$1
});

// Import vue components

const install = function installCsmlEditor(Vue) {
  Object.entries(components).forEach(_ref => {
    let [componentName, component] = _ref;
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()

export { __vue_component__$1 as CsmlMonacoEditor, MonacoEditor, install as default };

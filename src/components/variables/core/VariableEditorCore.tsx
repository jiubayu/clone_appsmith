import '../style.css';

import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  closeCompletion,
  moveCompletionSelection,
} from '@codemirror/autocomplete';
import {defaultKeymap, history, historyKeymap} from '@codemirror/commands';
import {javascript} from '@codemirror/lang-javascript';
import {
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import {Compartment, EditorState, Prec} from '@codemirror/state';
import {
  dropCursor,
  EditorView,
  hoverTooltip,
  keymap,
  tooltips,
} from '@codemirror/view';
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// 将 JSX 作为 children 渲染至 DOM 的不同部分
import {createPortal} from 'react-dom';

import {editableConfigure} from '../extensions/common/editableConfigure';
import {placeholderConfigure} from '../extensions/common/placeholderConfigure';
import {readOnlyConfigure} from '../extensions/common/readOnlyConfigure';
import {singleLineConfigure} from '../extensions/common/singleLineConfigure';
import {staticCompletion} from '../extensions/completions/static-completion';
import {customHighlighterPlugin} from '../extensions/highlighter/dynamicSyntaxHighlighter';
import {forbidRegExpDemoLinter} from '../extensions/linters/forbid-reg-exp-demo-linter';
import {changeUpdateListener} from '../extensions/listeners/changeUpdateListener';
import {focusUpdateListener} from '../extensions/listeners/focusUpdateListener';

import {themeLowcode} from '../themes/lowcode';
import {VariableEditorCoreProps} from '../types/editor';
import {intercept} from './variable-interceptor';

const language = new Compartment(),
  tabSize = new Compartment();

const keyMapExtensions = Prec.highest(
  keymap.of([
    {key: 'Escape', run: closeCompletion},
    {key: 'ArrowDown', run: moveCompletionSelection(true)},
    {key: 'ArrowUp', run: moveCompletionSelection(false)},
    {key: 'PageDown', run: moveCompletionSelection(true, 'page')},
    {key: 'PageUp', run: moveCompletionSelection(false, 'page')},
    {key: 'Tab', run: acceptCompletion},
    {key: 'Enter', run: acceptCompletion},
  ])
);

const wordHover = hoverTooltip((view, pos, side) => {
  const {from, to, text} = view.state.doc.lineAt(pos);

  let start = pos,
    end = pos;
  while (start > from && /\w/.test(text[start - from - 1])) start--;
  while (end < to && /\w/.test(text[end - from])) end++;
  if ((start == pos && side < 0) || (end == pos && side > 0)) return null;

  return {
    pos: start,
    end,
    above: true,
    create() {
      const dom = document.createElement('div');
      dom.textContent = text.slice(start - from, end - from);
      return {dom};
    },
  };
});

export function VariableEditorCore(props: VariableEditorCoreProps) {
  const {
    className,
    value = '',
    dataTree,
    editable = true,
    readOnly = false,
    placeholder,
    onChange,
    onFocus,
    onBlur,
  } = props;
    // console.log("🚀 ~ VariableEditorCore ~ dataTree:", dataTree)
  const [focused, setFocused] = useState(false);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const codeMirrorEditorRef = useRef<EditorView | null>(null);

  const basicExtension = [
    history(), // 撤销重做
    dropCursor(), // 丢弃光标
    indentOnInput(), // 输入时自动缩进
    closeBrackets(), // 括号匹配
    keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap]),
  ];

  const tooltipExtension = useMemo(() => {
    return tooltips({
      position: 'absolute',
      parent:
        document.querySelector<HTMLElement>('.cm-editor') || document.body,
    });
  }, []);

  const latestValue = useRef(value);
  const [evalRes, SetEvalRes] = useState('');
  const [evalError, setEvalError] = useState('');
  const [snippet, setSnippet] = useState(value ?? 'hello,{{user.name}}');

  useEffect(() => {
    if (value !== latestValue.current) {
      latestValue.current = value;
      setSnippet(value);
    }

    return () => {
      latestValue.current = '';
    };
  }, []);

  useEffect(() => {
    if(!snippet || !dataTree) return
    const {result, evalError} = intercept(snippet, dataTree);
    // console.log("🚀 ~ useEffect ~ snippet:", snippet)
    // console.log("🚀 ~ useEffect ~ evalError:", evalError)
    // console.log("🚀 ~ useEffect ~ result:", result)
    SetEvalRes(result);
    setEvalError(evalError);
  }, [snippet, dataTree]);

  useEffect(() => {
    // 避免重复渲染
    if (
      !codeMirrorEditorRef.current ||
      (!focused && value !== codeMirrorEditorRef.current.state.doc.toString())
    ) {
      if (editorWrapperRef.current) {
        const state = EditorState.create({
          doc: snippet,
          extensions: [
            themeLowcode,
            basicExtension,
            language.of(javascript()),
            tabSize.of(EditorState.tabSize.of(2)),

            // 语法高亮
            syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
            customHighlighterPlugin,
            editableConfigure(editable),
            placeholderConfigure(placeholder),
            readOnlyConfigure(readOnly),
            singleLineConfigure(true),

            forbidRegExpDemoLinter,

            wordHover,

            tooltipExtension,

            autocompletion({
              // 自动补全的数据来源，后续换成lsp
              override: [staticCompletion],
              defaultKeymap: false,
              closeOnBlur: true,
            }),

            // 默认快捷键绑定
            keymap.of(defaultKeymap),
            keyMapExtensions,
            // 事件相关
            changeUpdateListener({
              onChange: (value) => {
                onChange?.(value);
                setSnippet(value);
              },
            }),
            focusUpdateListener({
              onFocus: () => {
                setFocused(true);
                onFocus?.();
              },
              onBlur: (value: string) => {
                console.log('🚀 ~ useEffect ~ onBlur value:', value);
                setFocused(false);
                onBlur?.(value);
              },
            }),
          ],
        });

        if (codeMirrorEditorRef.current) {
          codeMirrorEditorRef.current.setState(state);
        } else {
          codeMirrorEditorRef.current = new EditorView({
            state,
            parent: editorWrapperRef.current,
          });
        }
      }
    }
  }, [snippet]);

  const style = useMemo(() => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return {};

    const {left, top, width, height} = wrapper.getBoundingClientRect();
    const commonStyle: CSSProperties = {
      position: 'absolute',
      minWidth: width,
      width: width + 2,
      top: top + height + 1,
      left: left - 1,
      zIndex: 100,
      borderRadius: 8,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      fontSize: 13,
      padding: 8,
    };

    if (evalError) {
      return {
        ...commonStyle,
        borderColor: 'red',
        color: 'red',
        backgroundColor: 'rgb(252,237,232)',
      };
    }
    // 成功样式
    return {
      ...commonStyle,
      borderColor: focused ? 'rgb(229, 230, 235)' : '',
      color: 'rgb(11, 182, 69)',
      backgroundColor: 'rgb(232, 255, 236)',
    };
  }, [focused, evalError]);

  const resultContent = evalError ? (
    <div style={style}>
      {evalError && (
        <div>
          {' '}
          <p style={{fontWeight: 'bold', marginBottom: 4}}>错误：</p>
          <p>{evalError}</p>
        </div>
      )}
    </div>
  ) : (
    <div style={style}>
      <div>
        <p style={{fontWeight: 'bold', marginBottom: 4}}>结果：String</p>
        <p>{evalRes || '-'}</p>
      </div>
    </div>
  );

  return (
    <div
      className={className}
      style={{
        border: '1px solid',
        borderColor: focused
          ? evalRes
            ? 'rgb(11, 182, 69)'
            : evalError
            ? 'red'
            : 'transparent'
          : 'transparent',
        borderRadius: 4,
        borderBottomLeftRadius: focused ? 0 : 4,
        borderBottomRightRadius: focused ? 0 : 4,
      }}
    >
      <div ref={editorWrapperRef}></div>
      {focused && createPortal(resultContent, document.body)}
    </div>
  );
}

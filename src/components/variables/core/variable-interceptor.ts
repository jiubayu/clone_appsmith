import {evalScript} from '../codeSandbox';
import {getSnippetString} from '../utils/getSnippetString';

/* 根据输入，查询到数据中的对应的参数值，并返回
 * @param script ['{{user}}']
 * @param dataTree 本地
 */
export function intercept(script: string, dataTree: Record<string, any>) {
  const snippetScript = getSnippetString(script); //['{{user}}']
  let evalResult = script;
  let evalError = ''

  try {
    // debugger;
    const results = snippetScript?.map(script => {
      // user
      const scriptValue = script.replace(/{{|}}/g, '');
      return evalScript(scriptValue, dataTree)
    }) ?? [];

    for (let i = 0;i<results.length;i++) {
      const result = results[i];
      evalResult = evalResult.replace(snippetScript?.[i] as string, result);
    }
  } catch (error) {
    evalError =( error as Error).message;
  }

  return {
    result: evalResult,
    evalError
  }
}

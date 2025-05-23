export const getSnippetString = (snippet: string) => {
  return snippet.match(/{{(.*?)}}/g);
};

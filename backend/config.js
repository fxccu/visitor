module.exports = {
  TARGET_URL: '', // 已废弃，不再转发到外部，仅本地处理,
  FEISHU_APP_ID: process.env.FEISHU_APP_ID || 'cli_a896784d3bf8d00c',
  FEISHU_APP_SECRET: process.env.FEISHU_APP_SECRET || 'M6DHsdYidcf7bZCvUbHFZgfnQy1oWJ8j',
  FEISHU_TABLE_TOKEN: process.env.FEISHU_TABLE_TOKEN || 'tblFsDjEw0I9miUg',
  FEISHU_TABLE_URL: 'https://open.feishu.cn/open-apis/bitable/v1/apps',
  FEISHU_APP_TOKEN: process.env.FEISHU_APP_TOKEN || 'DTbibc5vjaR2AJs5iE0chz9znOe'
};

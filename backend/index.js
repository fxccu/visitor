const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { TARGET_URL, FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_TABLE_TOKEN, FEISHU_TABLE_URL, FEISHU_APP_TOKEN } = require('./config');


const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/visitor', async (req, res) => {
  // 转换参数为飞书格式
  const feishuData = {
    VisitorName: req.body.visitorName,
    Phone: req.body.phone,
    VisitDate: req.body.visitDate,
    VisitPurpose: req.body.visitPurpose,
    HostName: req.body.hostName,
    HostPhone: req.body.hostPhone,
    IdNumber: req.body.idNumber,
    CarNumber: req.body.carNumber
  };
  try {
    // 1. 本地处理（不再转发到外部）
    const response = { data: { local: true } };

    // 2. 写入飞书多维表格
    let feishuResult = null;
    if (FEISHU_TABLE_TOKEN && FEISHU_APP_TOKEN) {
      try {
        const feishuRes = await axios.post(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_TOKEN}/records`,
          { fields: feishuData },
          {
            headers: {
              'Authorization': `Bearer ${await getFeishuTenantAccessToken()}`,
              'Content-Type': 'application/json'
            }
          }
        );
        feishuResult = feishuRes.data;
      } catch (feishuErr) {
        // 原代码
        // feishuResult = { error: feishuErr.message };
        // 修改后
        console.error('写入飞书多维表格时出错:', feishuErr);
        feishuResult = { error: '写入飞书多维表格时出错，请检查配置参数和网络连接。' };
        
        // 原代码
        // res.status(500).json({ success: false, error: err.message });
        // 修改后
        console.error('处理请求时出错:', err);
        res.status(500).json({ success: false, error: '服务器处理请求时出错，请稍后重试。' });
      }
    }

    res.status(200).json({ success: true, data: response.data, feishu: feishuResult });
  } catch (err) {
    console.error('处理请求时出错:', err);
res.status(500).json({ success: false, error: '服务器处理请求时出错，请稍后重试。' });
  }
});

// 获取飞书tenant_access_token
async function getFeishuTenantAccessToken() {
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) return '';
  const resp = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: FEISHU_APP_ID,
    app_secret: FEISHU_APP_SECRET
  });
  return resp.data.tenant_access_token;
}


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

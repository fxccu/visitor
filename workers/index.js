// 飞书配置通过env获取

// 处理CORS的headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 获取飞书tenant_access_token
async function getFeishuTenantAccessToken(env) {
  const FEISHU_APP_ID = env.FEISHU_APP_ID || '';
  const FEISHU_APP_SECRET = env.FEISHU_APP_SECRET || '';
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) return '';
  const resp = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET
    }),
  });
  const data = await resp.json();
  return data.tenant_access_token;
}

async function handleRequest(request, env) {
  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  // 只处理 POST 请求
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const reqData = await request.json();
    
    // 转换参数为飞书格式
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    // 计算北京时间（东八区）
    const bjNow = new Date(now.getTime() + 8 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60000);
    const todayStr = `${bjNow.getFullYear()}-${pad(bjNow.getMonth()+1)}-${pad(bjNow.getDate())} ${pad(bjNow.getHours())}:${pad(bjNow.getMinutes())}`;
    const feishuData = {
      VisitorName: reqData.visitorName,
      Phone: reqData.phone,
      VisitTime: todayStr,
      VisitPurpose: reqData.visitPurpose,
      HostName: reqData.hostName,
      HostPhone: reqData.hostPhone,
      IdNumber: reqData.idNumber,
      CarNumber: reqData.carNumber
    };

    let feishuResult = null;
    const FEISHU_TABLE_TOKEN = env.FEISHU_TABLE_TOKEN || '';
    const FEISHU_APP_TOKEN = env.FEISHU_APP_TOKEN || '';
    if (FEISHU_TABLE_TOKEN && FEISHU_APP_TOKEN) {
      try {
        const token = await getFeishuTenantAccessToken(env);
        const feishuRes = await fetch(
          `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_TOKEN}/records`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields: feishuData })
          }
        );
        feishuResult = await feishuRes.json();
      } catch (feishuErr) {
        console.error('写入飞书多维表格时出错:', feishuErr);
        feishuResult = { error: '写入飞书多维表格时出错，请检查配置参数和网络连接。' };
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { local: true }, 
        feishu: feishuResult 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (err) {
    console.error('处理请求时出错:', err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器处理请求时出错，请稍后重试。' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}

export default {
  async fetch(request, env, ctx) {
    return await handleRequest(request, env);
  }
}; 
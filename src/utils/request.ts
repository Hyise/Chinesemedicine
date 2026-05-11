import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/global';
import { message } from 'antd';

// ============================================================
// Axios 实例配置 - 适配 Python Django/FastAPI 后端标准响应格式
// ============================================================

// 读取后端 API 基础地址，默认为本地开发服务器
const BASE_URL = (import.meta as { env: Record<string, string> }).env.VITE_API_BASE_URL || 'http://localhost:8000';

// 创建 Axios 实例，配置超时与默认请求头
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// 请求拦截器
// ============================================================
instance.interceptors.request.use(
  (config) => {
    // 从 localStorage 读取 JWT Token（由后端 Python 签发）
    const token = localStorage.getItem('access_token');
    if (token) {
      // Python 后端通常使用 Bearer Token 认证
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 可在此处添加其他通用请求参数，如租户 ID、语言等
    // config.headers['X-Tenant-Id'] = localStorage.getItem('tenant_id');

    return config;
  },
  (error) => {
    // 请求配置错误，直接 reject
    return Promise.reject(error);
  }
);

// ============================================================
// 响应拦截器
// ============================================================
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message: msg } = response.data;

    // 根据后端约定的业务状态码进行分流处理
    // code === 200 通常表示业务成功（具体以 Python 后端接口定义为准）
    if (code === 200 || code === 0) {
      return response;
    }

    // 其他业务错误码（如 400、401、403、404 等），统一提示
    if (msg) {
      message.error(msg);
    }

    // 401 未授权 - Token 失效或无权限
    if (code === 401) {
      message.error('登录已过期，请重新登录');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    return Promise.reject(new Error(msg || '请求失败'));
  },
  (error) => {
    // 网络层或 HTTP 层错误处理
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          message.error(data?.message || '请求参数错误');
          break;
        case 401:
          // Token 失效处理
          message.error('未授权，请重新登录');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 403:
          message.error('无访问权限');
          break;
        case 404:
          message.error('请求资源不存在');
          break;
        case 500:
          message.error('服务器内部错误，请稍后重试');
          break;
        case 502:
          message.error('网关错误，服务不可用');
          break;
        case 503:
          message.error('服务暂时不可用');
          break;
        case 504:
          message.error('网关超时');
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应（通常是网络断开或 CORS 问题）
      message.error('网络连接失败，请检查网络');
    } else {
      // 请求配置本身出错
      message.error(error.message || '请求配置错误');
    }

    return Promise.reject(error);
  }
);

// ============================================================
// 封装常用 HTTP 方法（统一返回 data 字段）
// ============================================================

export const request = {
  get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.get<ApiResponse<T>>(url, { params, ...config }).then((res) => res.data.data);
  },

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  },

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  },

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.patch<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
  },

  delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.delete<ApiResponse<T>>(url, { params, ...config }).then((res) => res.data.data);
  },

  // 暴露原始实例，供特殊情况（如下载文件）使用
  instance,
};

export default request;

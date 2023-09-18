import { http } from "@/utils/http";

export type LinksResult = {
  code: number;
  message: string;
  result: any;
};

/** 获取友链列表 */
export const getLinksList = (data?: object) => {
  return http.request<LinksResult>("post", "/api/links/getLinksList", { data });
};

/** 新增/修改友链 */
export const addOrUpdateLinks = (data?: object) => {
  return http.request<LinksResult>("post", "/api/links/addOrUpdate", { data });
};

/** 审核友链 */
export const approveLinks = (data?: object) => {
  return http.request<LinksResult>("put", "/api/links/approve", { data });
};

/** 删除友链 */
export const deleteLinks = (data?: object) => {
  return http.request<LinksResult>("put", "/api/links/delete", { data });
};

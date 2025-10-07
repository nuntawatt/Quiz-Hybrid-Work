import axios from "axios";
import { cis } from "./api";
import { CIS_API_KEY, CIS_BASE_URL } from "./constants";

// =================== TYPES ===================
export interface StatusAPIResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

export type StatusItem = {
  _id: string;
  content: string;
  createdBy: { _id: string; email: string; image?: string };
  like: Array<{ _id: string; email: string; image?: string }>;
  comment: Array<{
    _id: string;
    content: string;
    createdBy: { _id: string; email: string; image?: string };
    like: any[];
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
};

// =================== HELPERS ===================
function normalizeArray(input: any): any[] {
  if (Array.isArray(input)) return input;
  if (Array.isArray(input?.data)) return input.data;
  if (Array.isArray(input?.items)) return input.items;
  if (Array.isArray(input?.results)) return input.results;
  return [];
}

// =================== AUTH ===================
export async function signin(email: string, password: string) {
  const res = await axios.post(
    `${CIS_BASE_URL}/signin`,
    { email, password },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": CIS_API_KEY,
      },
      timeout: 15000,
    }
  );

  const token = res.data?.data?.token as string | undefined;
  if (!token) throw new Error("ไม่พบ token จาก /signin");
  return { token, profile: res.data?.data };
}

// =================== CLASSROOM ===================
export async function getClassesByYear(year: string | number) {
  console.log("👩‍🎓 [getClassesByYear] calling:", `/class/${year}`);
  const { data } = await cis.get(`/class/${year}`);
  console.log("🧪 [getClassesByYear] raw payload:", data);
  const list = normalizeArray(data);
  console.log("✅ [getClassesByYear] normalized length:", list.length);
  return list;
}

// =================== STATUS ===================
export async function listStatuses(): Promise<StatusItem[]> {
  try {
    const { data } = await cis.get("/status");
    return normalizeArray(data) as StatusItem[];
  } catch (e) {
    console.warn("listStatuses error:", (e as any)?.response?.data || e);
    return [];
  }
}

export async function getStatusById(id: string): Promise<StatusAPIResponse<StatusItem>> {
  try {
    const response = await cis.get(`/status/${id}`);

    let statusData: StatusItem | null = null;
    if (response.data) {
      if (response.data.data) statusData = response.data.data;
      else if (response.data._id) statusData = response.data;
    }

    if (statusData) {
      return { success: true, data: statusData, message: "ดึงโพสต์สำเร็จ" };
    }
    return { success: false, message: "ไม่พบโพสต์ที่ระบุ" };
  } catch (error: any) {
    console.error("📄 Get status error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "ไม่สามารถดึงโพสต์ได้",
    };
  }
}

export async function createStatus(content: string): Promise<StatusItem> {
  const { data } = await cis.post(
    "/status",
    { content },
    { headers: { "Content-Type": "application/json" } }
  );
  return (data?.data ?? data) as StatusItem;
}

export async function deleteStatus(id: string): Promise<StatusAPIResponse<null>> {
  try {
    await cis.delete(`/status/${id}`);
    return { success: true, message: "ลบโพสต์สำเร็จ" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "ไม่สามารถลบโพสต์ได้",
    };
  }
}

// =================== LIKE / UNLIKE ===================
export async function likeStatus(statusId: string): Promise<StatusAPIResponse<null>> {
  try {
    const { data } = await cis.post(
      "/like",
      { statusId },
      { headers: { "Content-Type": "application/json" } }
    );
    return { success: true, message: "กดไลก์สำเร็จ" };
  } catch (error: any) {
    console.error("❤️ Like error:", error.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "ไม่สามารถกดไลก์ได้",
    };
  }
}

// DELETE /like
export async function unlikeStatus(statusId: string): Promise<StatusAPIResponse<null>> {
  try {
    const { data } = await cis.delete("/like", {
      data: { statusId },
      headers: { "Content-Type": "application/json" },
    });
    return { success: true, message: "ยกเลิกไลก์สำเร็จ" };
  } catch (error: any) {
    console.error("💔 Unlike error:", error.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "ไม่สามารถยกเลิกไลก์ได้",
    };
  }
}

// =================== COMMENT ===================
export async function commentStatus(statusId: string, content: string) {
  try {
    const { data } = await cis.post(
      "/comment",
      { content, statusId },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error: any) {
    console.error("💬 Comment error:", error.response?.data || error.message);
    throw error;
  }
}

// DELETE /comment/{commentId}
export async function deleteComment(
  statusId: string,
  commentId: string
): Promise<StatusAPIResponse<null>> {
  try {
    const response = await cis.delete(`/comment/${commentId}`, {
      data: { statusId },
      headers: { "Content-Type": "application/json" },
    });
    return { success: true, message: "ลบคอมเมนท์สำเร็จ" };
    } catch (error: any) {
    console.error("🗑️ Delete comment error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "ไม่สามารถลบคอมเมนท์ได้",
    };
  }
}

export async function listComments(id: string) {
  try {
    const { data } = await cis.get(`/status/${id}/comments`);
    return normalizeArray(data);
  } catch {
    const res = await getStatusById(id);
    return res.data?.comment ?? [];
  }
}

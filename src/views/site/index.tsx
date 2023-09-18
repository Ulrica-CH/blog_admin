import { ref, reactive, onMounted } from "vue";
import { getConfigDetail, updateConfigDetail, imgUpload } from "@/api/site";
import { message } from "@/utils/message";
import { ElLoading } from "element-plus";

export function useSite() {
  const siteInfoForm = reactive({
    id: 1,
    blog_name: "",
    blog_avatar: "",
    avatarList: [],
    avatar_bg: "", // 博客头像后的bg
    bgList: [],
    personal_say: "", // 个签
    blog_notice: "", // 公告
    qq_link: "",
    qqCoverList: [],
    we_chat_link: "",
    weChatCoverList: [],
    github_link: "",
    git_ee_link: "",
    bilibili_link: ""
  });

  const blogAvatarV = (rule: any, value: any, callback: any) => {
    if (!siteInfoForm.avatarList.length) {
      callback(new Error("请上传博客头像"));
    } else if (!siteInfoForm.bgList.length) {
      callback(new Error("请上传博客头像背景"));
    } else {
      callback();
    }
  };
  const siteInfoRules = reactive({
    blog_name: [{ required: true, message: "请输入博客名称", trigger: "blur" }],
    blog_avatar: { required: true, validator: blogAvatarV, trigger: "blur" },
    git_ee_link: { required: true, message: "请输入码云链接", trigger: "blur" }
  });

  const isEditSiteInfo = ref(false);

  async function save(type, formRef) {
    await formRef.validate(async valid => {
      if (valid) {
        switch (type) {
          case "site":
            await updateSiteConfig();
            isEditSiteInfo.value = false;
            break;
          default:
            return;
        }
      }
    });
  }

  function edit(type) {
    switch (type) {
      case "site":
        isEditSiteInfo.value = true;
        break;
      default:
        return;
    }
  }

  function cancel(type, ref) {
    ref.clearValidate();
    switch (type) {
      case "site":
        isEditSiteInfo.value = false;
        ref.clearValidate();
        initConfig();
        break;
      default:
        return;
    }
  }

  // 初始化网站设置
  async function initConfig() {
    const res = await getConfigDetail();
    if (res.code == 0) {
      if (res.result) {
        const { blog_avatar, avatar_bg, we_chat_link, qq_link } = res.result;
        Object.assign(siteInfoForm, res.result);
        if (blog_avatar) {
          siteInfoForm.avatarList = [
            {
              id: 1,
              name: blog_avatar.split("/").pop() || "未知名称",
              url: blog_avatar
            }
          ];
        }
        if (avatar_bg) {
          siteInfoForm.bgList = [
            {
              id: 2,
              name: avatar_bg.split("/").pop() || "未知名称",
              url: avatar_bg
            }
          ];
        }
        if (we_chat_link) {
          siteInfoForm.weChatCoverList = [
            {
              id: 3,
              name: we_chat_link.split("/").pop() || "未知名称",
              url: we_chat_link
            }
          ];
        }
        if (qq_link) {
          siteInfoForm.qqCoverList = [
            {
              id: 4,
              name: qq_link.split("/").pop() || "未知名称",
              url: qq_link
            }
          ];
        }
      }
    }
  }
  // 修改网站设置
  async function updateSiteConfig() {
    const imgUploading = ElLoading.service({
      fullscreen: true,
      text: "图片上传中......"
    });
    // 先上传图片
    if (siteInfoForm.bgList.length && !siteInfoForm.bgList[0].id) {
      const imgRes = await imgUpload(siteInfoForm.bgList[0]);
      if (imgRes.code == 0) {
        const { url } = imgRes.result;
        siteInfoForm.avatar_bg = url;
      }
    }
    if (siteInfoForm.avatarList.length && !siteInfoForm.avatarList[0].id) {
      const imgRes = await imgUpload(siteInfoForm.avatarList[0]);
      if (imgRes.code == 0) {
        const { url } = imgRes.result;
        siteInfoForm.blog_avatar = url;
      }
    }
    if (siteInfoForm.qqCoverList.length && !siteInfoForm.qqCoverList[0].id) {
      const imgRes = await imgUpload(siteInfoForm.qqCoverList[0]);
      if (imgRes.code == 0) {
        const { url } = imgRes.result;
        siteInfoForm.qq_link = url;
      }
    } else if (siteInfoForm.qqCoverList.length == 0) {
      siteInfoForm.qq_link = "";
    }
    if (
      siteInfoForm.weChatCoverList.length &&
      !siteInfoForm.weChatCoverList[0].id
    ) {
      const imgRes = await imgUpload(siteInfoForm.weChatCoverList[0]);
      if (imgRes.code == 0) {
        const { url } = imgRes.result;
        siteInfoForm.we_chat_link = url;
      }
    } else if (siteInfoForm.weChatCoverList.length == 0) {
      siteInfoForm.we_chat_link = "";
    }
    imgUploading.close();
    const res = await updateConfigDetail(siteInfoForm);
    if (res.code == 0) {
      message("网站设置修改成功", { type: "success" });
      initConfig();
    }
  }

  onMounted(() => {
    initConfig();
  });

  return {
    siteInfoForm,
    siteInfoRules,
    isEditSiteInfo,
    edit,
    save,
    cancel
  };
}

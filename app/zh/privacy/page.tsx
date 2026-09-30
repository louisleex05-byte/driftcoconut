import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 — driftcoconut",
  description: "driftcoconut 如何处理您的数据。",
  alternates: {
    canonical: "/zh/privacy",
    languages: {
      en: "/privacy",
      "zh-CN": "/zh/privacy",
      "x-default": "/privacy",
    },
  },
  openGraph: { locale: "zh_CN" },
};

export default function PrivacyPageZh() {
  return (
    <div className="max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-3xl font-bold">隐私政策</h1>
      <p className="text-sm text-slate-500">最后更新:2026 年 9 月</p>
      <p className="text-sm text-slate-500">
        本页为中文译本,仅供参考。如中英文内容有出入,以{" "}
        <a href="/privacy" className="text-sea-700">英文版</a> 为准。
      </p>

      <h2 className="text-xl font-semibold mt-8">我们收集哪些信息</h2>
      <p className="text-slate-600">
        您使用 driftcoconut 时,我们只收集帮助您搜索酒店所必需的信息,即您的搜索条件(目的地、日期、入住人数)。
        我们不要求您注册账户,也不会在本网站收集您的姓名、电子邮箱、电话号码或支付信息等个人信息。
      </p>

      <h2 className="text-xl font-semibold mt-8">Cookie 与数据分析</h2>
      <p className="text-slate-600">
        我们使用最少量的功能性 Cookie,用于在您访问期间记住您最近的搜索和偏好设置。我们可能使用汇总的、
        匿名化的数据分析工具(例如 Vercel Analytics 或 Google Analytics),以了解网站的整体使用情况并改进搜索体验。
      </p>
      <p className="text-slate-600">
        部分页面包含由我们的旅行合作伙伴提供的搜索框,例如通过 Travelpayouts 提供的 eSIM、机场接送和租车搜索框
        (供应商包括 Airalo、Welcome Pickups 和 GetRentacar 等)。这些搜索框加载时,提供方可能会在您的浏览器中设置自己的
        Cookie 或类似标识符,我们无法控制这些 Cookie。点击合作伙伴链接时,也可能设置 Cookie,以便合作伙伴将该次推荐记入我们名下。
        各提供方如何使用您的数据,以其各自的隐私政策为准。您可以在浏览器设置中屏蔽或删除这些 Cookie。
      </p>

      <h2 className="text-xl font-semibold mt-8">第三方预订</h2>
      <p className="text-slate-600">
        当您点击酒店的“立即预订”时,您将被转到合作伙伴网站(Agoda、Expedia、Booking.com 等)完成预订。
        您在合作伙伴网站上的预订、付款以及填写的任何个人信息,均受该合作伙伴自身隐私政策的约束。
        driftcoconut 不会接收或保存您的支付信息。
      </p>

      <h2 className="text-xl font-semibold mt-8">联盟营销披露</h2>
      <p className="text-slate-600">
        driftcoconut 参与联盟营销合作。当您通过我们的链接预订酒店时,合作伙伴可能向我们支付少量佣金,
        您无需额外付费。这不会影响我们展示哪些酒店,库存和价格均直接来自合作伙伴的实时数据。
      </p>

      <h2 className="text-xl font-semibold mt-8">您的权利</h2>
      <p className="text-slate-600">
        您可以随时通过浏览器清除 Cookie。如有任何隐私方面的问题,请联系{" "}
        <a href="mailto:privacy@driftcoconut.com" className="text-sea-700">privacy@driftcoconut.com</a>。
      </p>

      <h2 className="text-xl font-semibold mt-8">政策变更</h2>
      <p className="text-slate-600">
        我们可能会不时更新本政策。页面顶部的“最后更新”日期即为最近一次修订的时间。
      </p>
    </div>
  );
}

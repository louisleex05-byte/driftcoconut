import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用条款 — driftcoconut",
  description: "使用 driftcoconut 的条款。",
  alternates: {
    canonical: "/zh/terms",
    languages: {
      en: "/terms",
      "zh-CN": "/zh/terms",
      "x-default": "/terms",
    },
  },
  openGraph: { locale: "zh_CN" },
};

export default function TermsPageZh() {
  return (
    <div className="max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-3xl font-bold">使用条款</h1>
      <p className="text-sm text-slate-500">最后更新:2026 年 8 月</p>
      <p className="text-sm text-slate-500">
        本页为中文译本,仅供参考。如中英文内容有出入,以{" "}
        <a href="/terms" className="text-sea-700">英文版</a> 为准。
      </p>

      <h2 className="text-xl font-semibold mt-8">1. 关于本服务</h2>
      <p className="text-slate-600">
        driftcoconut 是一项酒店搜索与比价服务。我们展示由第三方预订合作伙伴提供的酒店列表、照片和价格。
        我们不直接销售酒店住宿。
      </p>

      <h2 className="text-xl font-semibold mt-8">2. 预订</h2>
      <p className="text-slate-600">
        所有预订均通过我们的合作伙伴网站(Agoda、Expedia、Booking.com 等)完成并由其履行。
        任何酒店住宿合同均在您与预订合作伙伴之间成立,适用其条款、取消政策和付款条款。
      </p>

      <h2 className="text-xl font-semibold mt-8">3. 价格与可订情况</h2>
      <p className="text-slate-600">
        driftcoconut 上显示的价格和可订情况由合作伙伴提供,可能随时变动,恕不另行通知。
        最终价格(包括税费、附加费用和任何优惠)以合作伙伴的预订页面为准。我们会合理努力保证信息准确,
        但对价格错误或差异不承担责任。
      </p>

      <h2 className="text-xl font-semibold mt-8">4. 照片与内容</h2>
      <p className="text-slate-600">
        driftcoconut 上展示的酒店照片、描述和点评归相应酒店或我们的预订合作伙伴所有,
        并根据我们的联盟协议获准使用。未经权利人明确许可,您不得复制、转发或再利用这些内容。
      </p>

      <h2 className="text-xl font-semibold mt-8">5. 联盟营销披露</h2>
      <p className="text-slate-600">
        当您通过本网站的链接预订时,我们会获得佣金。我们会清楚披露这一点,且不会影响您支付的价格。
      </p>

      <h2 className="text-xl font-semibold mt-8">6. 可接受的使用</h2>
      <p className="text-slate-600">
        您同意不抓取、批量下载、反向工程或以其他方式滥用本网站或我们合作伙伴的 API。
        未经事先书面同意,禁止自动化访问。
      </p>

      <h2 className="text-xl font-semibold mt-8">7. 责任限制</h2>
      <p className="text-slate-600">
        driftcoconut 按“现状”提供搜索结果。对于所列任何酒店的质量、安全性、可订情况或准确性,
        以及您通过合作伙伴网站预订所造成的任何损失,我们概不负责。
      </p>

      <h2 className="text-xl font-semibold mt-8">8. 适用法律</h2>
      <p className="text-slate-600">
        本条款受泰国法律管辖。任何争议应提交泰国曼谷的法院解决。
      </p>

      <h2 className="text-xl font-semibold mt-8">9. 联系方式</h2>
      <p className="text-slate-600">
        如对本条款有疑问,请发送邮件至{" "}
        <a href="mailto:legal@driftcoconut.com" className="text-sea-700">legal@driftcoconut.com</a>。
      </p>
    </div>
  );
}

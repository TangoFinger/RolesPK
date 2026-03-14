import React from 'react'

const EMAIL = 'mwt100314@163.com'

export default function Footer() {
  return (
    <footer className="border-t border-[#2d2d4e] py-6 px-4 text-center text-gray-600 text-sm">
      <p className="mb-1">RolesPK · 数据仅供娱乐参考 · 版权归原作者所有</p>
      <p>
        联系邮箱：<a href={`mailto:${EMAIL}`} className="text-orange-400 hover:text-orange-300 transition-colors">{EMAIL}</a>
      </p>
    </footer>
  )
}

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // 启用 2009 语法支持，确保 Flexbox 在所有老旧手机设备上 100% 不变形
      flexbox: 'no-2009',
    },
  },
}

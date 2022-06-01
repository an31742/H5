// 代人提单项目 添加  实际申请人
export function setApplyLaunderItem (
  {
    allowReplace, launcherScope, templateId,
    applyLauncher, visibility
  }
  , widgetForm
) {
  if (allowReplace === 1 &&
      !widgetForm.includes(t => t.code === 'applyLauncher')
  ) {
    widgetForm.unshift(
      {
        visibility: visibility,
        required: true,
        code: 'applyLauncher',
        name: '实际申请人',
        props: {
          current: true,
          permission: launcherScope,
          templateId: templateId,
          type: 'applyLauncher',
          mode: 'single'
        },
        type: 'FormLinkStaff',
        value: applyLauncher || undefined
      }
    )
  }
}

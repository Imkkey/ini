const ini = require('../')
const t = require('tap')

t.test('nested sections replace null parent values', t => {
  t.same(ini.parse('parent=null\n[parent.child]\nvalue=ok'), {
    parent: { child: { value: 'ok' } },
  })
  t.end()
})

t.test('deeply nested sections replace null parent values', t => {
  t.same(ini.parse('parent=null\n[parent.child.grandchild]\nvalue=ok'), {
    parent: { child: { grandchild: { value: 'ok' } } },
  })
  t.end()
})

t.test('nested sections replace null intermediate values in either order', t => {
  const parent = '[parent]\nchild=null\nkeep=ok'
  const child = '[parent.child.grandchild]\nvalue=ok'
  for (const sections of [`${parent}\n${child}`, `${child}\n${parent}`]) {
    t.same(ini.parse(sections), {
      parent: { keep: 'ok', child: { grandchild: { value: 'ok' } } },
    })
  }
  t.end()
})

t.test('null leaf values remain null', t => {
  t.same(ini.parse('root=null\n[parent]\nchild=null\n[parent.other]\nvalue=null'), {
    root: null,
    parent: { child: null, other: { value: null } },
  })
  t.end()
})

t.test('nested sections continue to replace other scalar parent values', t => {
  for (const value of ['', 'false', 'true', '0', 'text']) {
    t.same(ini.parse(`parent=${value}\n[parent.child]\nvalue=ok`), {
      parent: { child: { value: 'ok' } },
    })
  }
  t.end()
})

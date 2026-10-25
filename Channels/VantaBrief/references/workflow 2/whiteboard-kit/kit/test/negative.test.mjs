// Proves the guardrails bite. Run: node test/negative.test.mjs
import { planVideo } from '../src/core/plan.mjs';
import { lintPlan } from '../src/core/lint.mjs';
import { LayoutError } from '../src/core/layout.mjs';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`); };
const run = (scene) => planVideo({ meta: {}, scenes: [scene] }, { words: null, dims: {} });
const throwsLayout = (scene) => { try { run(scene); return false; } catch (e) { return e instanceof LayoutError; } };

// 1. 9-node flow is rejected
const nodes = Array.from({ length: 9 }, (_, i) => ({ id: 'n' + i, label: 'node ' + i }));
ok('rejects flow with 9 nodes', throwsLayout({ id: 'x', type: 'flow', dur: 8, nodes, edges: nodes.slice(1).map(n => ['n0', n.id]) }));

// 2. absurdly long labels in a 5-column chain are rejected instead of shrinking below the font floor
const chain = ['a', 'b', 'c', 'd', 'e', 'f'].map(id => ({ id, label: 'a really quite long label that cannot possibly fit on screen' }));
ok('rejects too-wide flow instead of shrinking text', throwsLayout({ id: 'x', type: 'flow', dur: 8, nodes: chain, edges: chain.slice(1).map((n, i) => [chain[i].id, n.id]) }));

// 3. cyclic flow rejected
ok('rejects cycles', throwsLayout({ id: 'x', type: 'flow', dur: 8, nodes: [{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }, { id: 'c', label: 'c' }], edges: [['a', 'b'], ['b', 'c'], ['c', 'b']] }));

// 4. scene longer than 12s fails lint
let p = run({ id: 'long', type: 'stat', dur: 15, value: '$5', label: 'per month' });
ok('lint rejects 15s scene', lintPlan(p, { allowMissing: true }).errors.some(e => e.includes('Split it')));

// 5. hand-corrupted plan: overlap, off-screen, tiny font, camera out of canvas
p = run({ id: 'ok', type: 'stat', dur: 6, value: '$5', label: 'per month' });
const sc = p.scenes[0];
sc.items[1].x = sc.items[0].x; sc.items[1].y = sc.items[0].y;                 // overlap
sc.items.push({ id: 'off', kind: 'node', x: 1800, y: 40, w: 400, h: 100, size: 24, lines: ['x'] }); // off-screen + tiny
sc.camera.push({ t: 1, s: 1.5, cx: 100, cy: 100 });                           // viewport leaves canvas
const r = lintPlan(p, { allowMissing: true }).errors.join('\n');
ok('lint catches overlap', /overlaps/.test(r));
ok('lint catches off-safe-area', /leaves the safe area/.test(r));
ok('lint catches font < 32px', /font 24px/.test(r));
ok('lint catches camera leaving canvas', /viewport leaves the canvas/.test(r));

// 6. mascot overlapping content
p = run({ id: 'm', type: 'stat', dur: 6, value: '$5', label: 'per month' });
p.scenes[0].mascot = { x: p.scenes[0].items[0].x, y: p.scenes[0].items[0].y, w: 190, h: 230 };
ok('lint catches mascot overlap', lintPlan(p, { allowMissing: true }).errors.some(e => e.includes('mascot overlaps')));

// 7. missing asset is an error unless allowed
p = run({ id: 'f', type: 'flow', dur: 6, nodes: [{ id: 'a', label: 'A', logo: 'nope' }] });
ok('missing logo is an ERROR by default', lintPlan(p, { root: '/tmp/none' }).errors.some(e => e.includes('missing')));

// 8. positive: the real example still passes
import fs from 'node:fs';
const beats = JSON.parse(fs.readFileSync(new URL('../beats.example.json', import.meta.url)));
const good = planVideo(beats, { words: null, dims: {} });
ok('example beats pass lint (assets allowed missing)', lintPlan(good, { allowMissing: true }).errors.length === 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

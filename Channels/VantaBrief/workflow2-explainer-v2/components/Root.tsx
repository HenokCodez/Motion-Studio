import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {registry} from './animations';
import {SceneVideo} from './SceneVideo';
import {customRegistry} from './custom';
import plan from '../scene-plan.json';
const Root: React.FC = () => <>{[...registry, ...customRegistry].map(a => (
  <Composition key={a.meta.id} id={a.meta.id} component={a.Component as any} durationInFrames={a.meta.duration} fps={30} width={1920} height={1080} />))}<Composition id="Video" component={SceneVideo as any} durationInFrames={Math.max(30, Math.round(Math.max(...(plan as any).scenes.map((x: any) => x.end)) * 30))} fps={30} width={1920} height={1080} defaultProps={{plan} as any} /></>;
registerRoot(Root);

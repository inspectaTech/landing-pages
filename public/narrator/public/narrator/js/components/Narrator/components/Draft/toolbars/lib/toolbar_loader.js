import {lazy} from 'react';

const BasicToolbar = lazy(() => import(/* webpackChunkName: "templates/draft/formTemplates" */ `../components/BasicToolbar`));

// const FullToolbar = lazy(() => import(/* webpackChunkName: "templates/draft/formTemplates" */ `../components/FullToolbar`));

const BlockToolbar = lazy(() => import(/* webpackChunkName: "templates/draft/formTemplates" */ `../components/BlockToolbar`));

const CodeToolbar = lazy(() => import(/* webpackChunkName: "templates/draft/formTemplates" */ `../components/CodeToolbar`));

export default {BasicToolbar,/*FullToolbar,*/ BlockToolbar, CodeToolbar};

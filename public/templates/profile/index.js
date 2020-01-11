
import { lazy } from "react";

console.log("[loading lazy]");

const BasicProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Basic" */ `./BasicProfile`));

const SomeProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Some" */ `./SomeProfile`));

const AnotherProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Another" */ `./AnotherProfile`));

// const DefaultProfile = lazy(() => import(/* webpackChunkName: "Default" */ `./DefaultProfile`));// Default fails


export default { /*DefaultProfile,*/ BasicProfile, SomeProfile, AnotherProfile } ;

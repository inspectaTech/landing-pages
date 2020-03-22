
import { lazy } from "react";

console.log("[profile] loading lazy");

const BasicProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Basic" */ `./BasicProfile/BasicProfile`));

const SomeProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Some" */ `./SomeProfile`));

const AnotherProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Another" */ `./AnotherProfile`));

// const DefaultProfile = lazy(() => import(/* webpackChunkName: "Default" */ `./DefaultProfile`));// Default fails


export default { /*DefaultProfile,*/ BasicProfile, SomeProfile, AnotherProfile } ;

// NOW: dynamic imports - profile templates collection
// ATTN: the names i.e. "templates/profile/Basic" are correct. it allows my to create separate files
// in the templates/profile folder - i want each of these templates to only load if the user interacts with
// them otherwise they will never be loaded.


import { lazy } from "react";

console.log("[profile] loading lazy");

/**
 * @category Presets
 * @subcategory init
 * @module Templates
 * @desc hub for individual paper items displays
 * @param {object} props whats in the props
 * @see [Page]{@link module:Page}
 * @requires BasicProfile
 */

/**
 * @file
 */

const BasicProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Basic" */ `./BasicProfile`));

const SomeProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Some" */ `./SomeProfile`));

const AnotherProfile = lazy(() => import(/* webpackChunkName: "templates/profile/Another" */ `./AnotherProfile`));

// const DefaultProfile = lazy(() => import(/* webpackChunkName: "Default" */ `./DefaultProfile`));// Default fails


export default { /*DefaultProfile,*/ BasicProfile, SomeProfile, AnotherProfile } ;

// LATER: profile temlates

// ATTN: the names i.e. "templates/profile/Basic" are correct. it allows my to create separate files
// in the templates/profile folder - i want each of these templates to only load if the user interacts with
// them otherwise they will never be loaded.

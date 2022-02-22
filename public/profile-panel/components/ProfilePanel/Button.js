import { useEffect } from "react";

const Button = ({
  uuid
}) => {
  // useEffect(() => {
  //   document.addEventListener('DOMContentLoaded', async function () {
  //     let home_btn = document.querySelector(".pp_panelHomeBtn");
  //     home_btn.href = `${location.origin}/core/`;
  //     home_btn.target = "_self";
  //   });
  // }, []);
  const sidebar_id = `pp_sidebar${uuid}`;
  return (
    <div id="profile_panel_icon_box" class="profile_panel_icon_box" >
      <a id="pp_panelHomeBtn" class="pp_panelHomeBtn icon-home d3-ico d3-disc d3-disc-outer d3-disc d3-disc-outer-outer d3-disc-bg"
        title="home" style="text-decoration: none;">
      </a>
      <div id="pp_panelCtrl" class="pp_panelCtrl pp_panelBtn icon-user d3-ico d3-disc d3-disc-outer d3-disc d3-disc-outer-outer d3-disc-bg"
        title="profile panel controls"
        onClick={() => {
          document.querySelector(`#${sidebar_id}`).classList.add('active');
        }}
      >
      </div>
      <!-- href="#pp_panel" -->
    </div>
  )
}

export default Button;
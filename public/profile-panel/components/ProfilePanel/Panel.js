import { useEffect } from "react";
require('./ProfilePanel.scss');
require('./style.scss');


const Panel = ({
  uuid = ""
}) => {
  // useEffect(() => {
  //   let sign_out_btn = document.querySelector(".pp_sign_out");
  //   // home_btn.href = `${location.origin}/core/`;
  //   // home_btn.target = "_self";
  //   sign_out_btn.addEventListener("click", () => {
  //     localStorage.removeItem('JWT_TOKEN');
  //     axios.defaults.headers.common['Authorization'] = '';

  //     location.reload();
  //   })
  // }, [])
  const sidebar_id = `pp_sidebar${uuid}`;
  return (
    <div class="wrapper">
      <!-- Sidebar -->
      <nav id={sidebar_id} class="pp_panel dark_bg">

        <div id="pp_close_cont" class="pp_close_cont">
          <div id="pp_panel_cls_btn" class={`${sidebar_id} pp_panel_cls_btn pp_dismiss close_btn icon-cross d3-ico d3-disc d3-disc-outer`}
          onClick={(params) => {
            document.querySelector(`#${sidebar_id}`).classList.remove('active');
          }}
          ></div>
        </div>
        <div id="pp_mxr_cont" class="pp_mxr_cont"></div>
        <div id="pp_mobx_cont" class="pp_mobx_cont"></div>
        <div id="pp_content_cont" class="pp_content_cont"></div>
        <div id="pp_sign_out" class="pp_sign_out">Sign Out</div>
      </nav>

    </div>
  )
}

export default Panel;

// IMPORTANT: DOCS: FOR pp_sign_out click event, see pp_panel.hbs
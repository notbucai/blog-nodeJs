
(function (window) {
  $(function () {

    $("body").click(function (e) {
      let wF = "hide";
      if ($('.search').find($(e.target)).length) {
        wF = "show";
      }
      $(".search .search-form").animate({
        width: wF
      });
    });

    $(window).scroll(function () {
      // console.log($(this).scrollTop());

      //当window的scrolltop距离大于1时，go to 
      if ($(this).scrollTop() > 100) {
        $('.backtop').fadeIn();
      } else {
        $('.backtop').fadeOut();
      }
    });

    $(window).scroll();

    $(".backtop").click(function () {
      $('html , body').animate({ scrollTop: 0 }, 'slow');
    });

    $("#tabul").click(function (e) {
      if ($(this).find(e.target).length) {

        $("#tabcontent > li").add($("#tabul>li")).each(function (i, v) {
          $(v).removeClass("active");
        });
        console.log($("#tabcontent > li").eq($("#tabul>li").index($(e.target))));

        $("#tabcontent > li").eq($("#tabul>li").index($(e.target))).add(e.target).addClass('active');

      }
    });

    $('.at').click(function () {

      $('.comment-item').removeClass("active");
      $('html, body').animate({ scrollTop: $('#' + $(this).data("anchor")).addClass('active').offset().top - ($("#header").height()) }, 400)

    });
  });

  $('.comment-action').click(function (e) {

    const commentForm = $("#commentForm");
    const iss = $(this).data('is');
    $('.comment-action').text("回复").data('is', "");

    if (!iss) {

      const this_comment = $(this).text("取消回复").data('is', "true").parents('li').append(commentForm);
      $('html , body').animate({ scrollTop: this_comment.offset().top - ($("#header").height()) - 15 }, 'slow');
      commentForm.find('.form-textarea').focus();

      $("#r_u_id").val($(this).data("u_id"));
      // console.log($(this).data("u_id"));

    } else {

      $("#r_u_id").val("");
      $("#commentContainer").append(commentForm);

    }

  });

  $("#comment_login").submit(function (e) {
    e.preventDefault();
    const data = $(this).serialize();

    try {
      const dataForm_Arr = data.split('&');
      const dataForm = {};
      for (const item of dataForm_Arr) {
        const s = item.split("=");
        const name = $.trim(s[0]),
          value = decodeURI($.trim(s[1]));
        dataForm[name] = value;
      }
      console.log(JSON.stringify(dataForm));
      if (!dataForm.u_login || !dataForm.u_pwd) {
        $("#info_modal").modal("show").find(".modal-content").text("都不能为空");
        return;
      }
      // ajax
      const api = $(this).attr("action");
      $.ajax({
        type: "POST",
        url: api,
        data: JSON.stringify(dataForm),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function ({ code, msg }) {

          $("#info_modal").modal("show").find(".modal-content").text(msg);
          if (code == 200) {
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }
          //    console.log(msg,code);

        },
        error: function (xhr, status, error) {
          $("#info_modal").modal("show").find(".modal-content").text(error);
          console.log(xhr, status, error);
        },

      });

    } catch (error) {
      console.error(error);

    }

  });

  $("#comment_o").submit(function (e) {

    e.preventDefault();
    const data = $(this).serialize();

    try {
      const dataForm_Arr = data.split('&');
      const dataForm = {};
      for (const item of dataForm_Arr) {
        const s = item.split("=");
        const name = $.trim(s[0]),
          value = decodeURI($.trim(s[1]));
        dataForm[name] = value;
      }
      console.log(JSON.stringify(dataForm));
      if (!dataForm.content) {
        $("#info_modal").modal("show").find(".modal-content").text("不能为空");
        return;
      }
      // ajax
      const api = $(this).attr("action");
      $.ajax({
        type: "POST",
        url: api,
        data: JSON.stringify(dataForm),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function ({ code, msg }) {

          $("#info_modal").modal("show").find(".modal-content").text(msg);
          if (code == 200) {
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }
          //    console.log(msg,code);

        },
        error: function (xhr, status, error) {
          $("#info_modal").modal("show").find(".modal-content").text(error);
          console.log(xhr, status, error);
        },

      });

    } catch (error) {
      console.error(error);

    }


  });

  function v_form(name, val) {
    let reg = /^.+$/;
    let errmsg = "格式不正确";
    switch (name) {
      case "u_email":
        reg = /([@]|\%40)[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        break;
      case "u_name":
        reg = /(^.{4,20}$)/;
        errmsg = "长度不能少于4位也不能大于20个字符";
        break;
      case "u_pwd":
        reg = /(^.{6,}$)/;
        errmsg = "长度不能少于6位";
        break;

      default:
        reg = /(^.+$)/;
        errmsg = "不能为空";
        break;
    }
    // console.log(reg);

    return { result: reg.test(val), errmsg };
  }

  $("#rl_form").submit(function (e) {
    e.preventDefault();
    $('.input').trigger("input");

    const data = $(this).serialize();

    try {
      const dataForm_Arr = data.split('&');
      const dataForm = {};
      for (const item of dataForm_Arr) {
        const s = item.split("=");
        const name = $.trim(s[0]),
          value = decodeURI($.trim(s[1]));
        const res = v_form(name, value);

        if (!res.result) {
          // console.log(item, res, s);
          return;
        }
        dataForm[name] = value;
      }
      // console.log(JSON.stringify(dataForm));

      // ajax
      const api = $(this).attr("action");
      $.ajax({
        type: "POST",
        url: api,
        data: JSON.stringify(dataForm),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function ({ code, msg }) {

          $("#info_modal").modal("show").find(".modal-content").text(msg);

          if (code == 200) {

            if (api.indexOf('login') != -1) {
              setTimeout(() => {
                window.location.href = "/";
              }, 600);
            } else if (api.indexOf('reg') != -1) {
              setTimeout(() => {
                window.location.href = "/login";
              }, 600);
            } else if (api.indexOf('repwd') != -1) {
              setTimeout(() => {
                window.location.href = "/login";
              }, 600);
            }

          } else {
            $("input[name=u_pwd]").val("").addClass('animated rubberBand err');
          }


        },
        error: function (xhr, status, error) {
          $("#info_modal").modal("show").find(".modal-content").text(error);
          console.log(xhr, status, error);
        },

      });

    } catch (error) {
      console.error(error);

    }

  });

  // let is_time = null;
  $("#sform .input").on("input propertychange", function () {

    clearTimeout(this.is_time);
    this.is_time = setTimeout(() => {

      const name = $(this).attr("name");
      const res = v_form(name, $(this).val());
      if (res.result) {
        $(this).removeClass('animated rubberBand err').parents('.form-box').find(".form-info").hide();
      } else {
        $(this).removeClass('animated rubberBand err');
        $(this).addClass('err').addClass('animated rubberBand err').parents('.form-box').find(".form-info").text(res.errmsg).show();
      }
    }, 400);

  });

  $("#code").click(function () {
    const _this = this;
    const stat = $(_this).data("stat");

    if (!stat) {

      let errmsg = "错误";

      const u_data = $("input[name=u_email]").val();

      if (!u_data) {
        errmsg = "邮箱不能为空";
        $("input[name=u_email]").focus().addClass('err').addClass('animated rubberBand').parents('.form-box').find(".form-info").text(errmsg).show();
        setTimeout(() => {
          $("input[name=u_email]").removeClass('animated rubberBand');
        }, 800);
        return;
      }

      // 发送json
      $(_this).html(`<span>正在获取</span>`);

      // 这里执行ajax
      $.ajax({
        type: "POST",
        url: "/api/code",
        data: JSON.stringify({ u_email: $("input[name=u_email]").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function ({ code, msg }) {
          $("#info_modal").modal("show").find(".modal-content").text(msg);

          if (code != 200) {
            $(_this).html(`<span>获取失败</span>`);

            return;
          }
          $(_this).html(`<span>获取成功</span>`);
          $(_this).data("stat", "true");
          let iii = 60;
          const s_i = setInterval(() => {

            $(_this).html(`<span>${iii--} S 后重新获取</span>`);
            if (!iii) {
              clearInterval(s_i);
              $(_this).data("stat", null);
              $(_this).html(`<span>重新获取</span>`);
              return;
            }

          }, 1000);
        }
      });


    }

  });

  $(".unfollowed").hover(function () {
    $(this).addClass("unfollow").text("取消关注");
  }, function () {
    $(this).removeClass("unfollow").text("已关注");
  });

  $('.userinfoNavs').click(function (e) {
    e.preventDefault();

    if ($(e.target).prop('tagName') !== "LI")
      return;

    const index = $(this)
      .children()
      .removeClass('active')
      .index(
        $(e.target)
          .addClass('active')
      );

    $('.userinfoList > div')
      .removeClass('active')
      .eq(index)
      .addClass('active');
  });

})(window);

(function (window, $) {
  $(function () {

    $("#uoload_img").click(function (e) {
      e.preventDefault();

      $('<input type="file" name="file"/>').click().on('change', function (e) {
        const files = $(this).get(0).files;
        if (!files.length) {
          return;
        }
        const file = files[0];
        if (!v_file_type(file.type)) {
          alert("格式不正确");
          return;
        }
        const formData = new FormData();
        formData.append('img', file);

        $.ajax({
          url: "/api/uploadImg",
          type: "POST",
          data: formData,
          dataType: "JSON",
          cache: false,
          processData: false,
          contentType: false
        }).done(function (ret) {
          if (ret.code != "0000") {
            alert(ret.msg);
          }
          $("#u_img").val(ret.data.src);
          $("#u_img_show").attr('src', ret.data.src);
          alert("上传成功");

        });
        
      });

    });


  });
  function v_file_type(type) {

    switch (type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return true;
    }
    return false;
  }
})(window, $);

/**
 * 雪花
 */
(function (window) {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
  window.requestAnimationFrame = requestAnimationFrame;
  var flakes = [],
    canvas = document.getElementById("Snow"),
    ctx = canvas.getContext("2d"),
    flakeCount = 100,
    mX = -100,
    mY = -100;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < flakeCount; i++) {
      var flake = flakes[i],
        x = mX,
        y = mY,
        minDist = 100,
        x2 = flake.x,
        y2 = flake.y;
      var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
        dx = x2 - x,
        dy = y2 - y;
      if (dist < minDist) {
        var force = minDist / (dist * dist),
          xcomp = (x - x2) / dist,
          ycomp = (y - y2) / dist,
          deltaV = force / 2;
        flake.velX -= deltaV * xcomp;
        flake.velY -= deltaV * ycomp;
      } else {
        flake.velX *= 0.98;
        if (flake.velY <= flake.speed) { flake.velY = flake.speed; }
        flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
      }
      ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
      flake.y += flake.velY;
      flake.x += flake.velX;
      if (flake.y >= canvas.height || flake.y <= 0) { reset(flake); }
      if (flake.x >= canvas.width || flake.x <= 0) { reset(flake); }
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(snow);
  };

  function reset(flake) {
    flake.x = Math.floor(Math.random() * canvas.width);
    flake.y = 0;
    flake.size = (Math.random() * 3) + 2;
    flake.speed = (Math.random() * 1) + 0.5;
    flake.velY = flake.speed;
    flake.velX = 0;
    flake.opacity = (Math.random() * 0.5) + 0.3;
  }

  function init() {
    for (var i = 0; i < flakeCount; i++) {
      var x = Math.floor(Math.random() * canvas.width),
        y = Math.floor(Math.random() * canvas.height),
        size = (Math.random() * 3) + 2,
        speed = (Math.random() * 1) + 0.5,
        opacity = (Math.random() * 0.5) + 0.3;
      flakes.push({ speed: speed, velY: speed, velX: 0, x: x, y: y, size: size, stepSize: (Math.random()) / 30 * 1, step: 0, angle: 180, opacity: opacity });
    }
    snow();
  };
  document.addEventListener("mousemove", function (e) { mX = e.clientX, mY = e.clientY });
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  init();
})(window);
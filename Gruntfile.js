const fs = require("fs");

let gruntOptions = null,
  appName = "",
  appId = "",
  wgtPath = "",
  tizenCLIPath = "",
  tizenScriptPath = "",
  tvPath = "",
  tvIP = "",
  profileName = "",
  profilePath = "";

module.exports = grunt => {
  "use strict";
  require("load-grunt-tasks")(grunt, {
    scope: "devDependencies"
  });

  if (fs.existsSync("./grunt-options.js")) {
    gruntOptions = require("./grunt-options.js");
    appName = gruntOptions.appName;
    appId = gruntOptions.appId;
    wgtPath = gruntOptions.wgtPath;
    tizenCLIPath = gruntOptions.tizenCLIPath;
    tizenScriptPath = gruntOptions.tizenScriptPath;
    tvPath = gruntOptions.tvPath;
    tvIP = gruntOptions.tvIP;
    profileName = gruntOptions.profileName;
    profilePath = gruntOptions.profilePath;
  }

  let SOURCE_PATH = "src",
    devToolsAdress,
    devToolsPort;

  function findDevToolsPort(err, stdout, stderr, cb) {
    if (err) {
      cb(err);
      return;
    }
    cb();
    devToolsPort = stdout.match(/port: ([0-9]+)/);
    devToolsPort = devToolsPort[1];
    devToolsAdress = `${tvIP}:${devToolsPort}`;
  }

  grunt.initConfig({
    watch: {
      js: {
        files: [SOURCE_PATH + "/js/**/*.js"],
        tasks: ["webpack"]
      },
      sass: {
        files: [SOURCE_PATH + "/scss/**/*.scss"],
        tasks: ["sass"]
      }
    },
    autoprefixer: {
      options: {
        browsers: ["last 8 versions"]
      },
      dist: {
        files: {
          "dist/css/style.css": "dist/css/style.css"
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "dist/css/style.css": SOURCE_PATH + "/scss/main.scss"
        }
      }
    },
    copy: {
      debug: {
        files: [
          {
            expand: true,
            cwd: SOURCE_PATH + "/",
            src: ["**", "!scss/**", "!js/**"],
            dest: "dist/",
            dot: true
          }
        ]
      }
    },
    shell: {
      build: {
        command: [
          `${tizenCLIPath}${tizenScriptPath} build-web -- ./dist`,
          `${tizenCLIPath}${tizenScriptPath} package --sign ${profileName} --type wgt -- ./dist/.buildResult`,
          `mv ./dist/.buildResult/${appName}.wgt ./dist`
        ].join("&&")
      },
      deployTizen_3_0: {
        command: [
          `${tizenCLIPath}/tools/sdb disconnect`,
          `${tizenCLIPath}/tools/sdb connect ${tvIP}`,
          `${tizenCLIPath}/tools/sdb -e shell pkgcmd -u -n ${appId}`,
          `${tizenCLIPath}/tools/sdb install ${wgtPath}${appName}.wgt`,
          `${tizenCLIPath}/tools/sdb -e shell app_launcher -w -s ${appId}.${appName}`
        ].join("&&"),
        options: {
          callback: findDevToolsPort
        }
      },
      runDevTools: {
        command: function() {
          return "google-chrome " + devToolsAdress;
        }
      },
      // @TODO check url luncher
      createURLLuncherFolder: {
        command: [
          "node ./config/upgradeVersion.js",
          "mkdir -p url-luncher",
          `cp ./dist/${appName}.wgt url-luncher`,
          "cp ./config/sssp_config.xml url-luncher",
          "ls url-luncher",
          "http-server url-luncher"
        ].join("&&")
      },
      signCertificateToCli: {
        command: `${tizenCLIPath + tizenScriptPath} cli-config -g profiles.path=${profilePath}`
      }
    },
    webpack: {
      debug: require("./webpack.config.js")
    }
  });

  grunt.registerTask("build", [
    "sass",
    "autoprefixer",
    "webpack",
    "copy:debug"
  ]);
  grunt.registerTask("build-deploy", [
    "build",
    "shell:build",
    "shell:deployTizen_3_0",
    "shell:runDevTools"
  ]);
  // @TODO check Windows build
  grunt.registerTask("deployWin", ["build-debug", "shell:deployWin"]);
  // @TODO check url-luncher
  grunt.registerTask("url-luncher", [
    "build",
    "shell:build",
    "shell:createURLLuncherFolder"
  ]);
};

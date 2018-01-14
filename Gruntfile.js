const fs = require("fs");
const path = require("path");

let gruntOptions = null,
  appName = "",
  appId = "",
  tizenCLIPath = "",
  tizenScriptPath = "",
  tvPath = "",
  tvIP = "",
  profileName = "",
  profilePath = "",
  distPath = "dist/debug/",
  devToolsAdress,
  devToolsPort;

const findDevToolsPort = (err, stdout, stderr, cb) => {
  if (err) {
    cb(err);
    return;
  }
  cb();
  devToolsPort = stdout.match(/port: ([0-9]+)/);
  devToolsPort = devToolsPort[1];
  devToolsAdress = `${tvIP}:${devToolsPort}`;
};

module.exports = grunt => {
  require("load-grunt-tasks")(grunt, {
    scope: "devDependencies"
  });

  if (process.env.NODE_ENV === "production") {
    distPath = "dist/release/";
  }

  if (fs.existsSync("./grunt-options.js")) {
    gruntOptions = require("./grunt-options.js");
    appName = gruntOptions.appName;
    appId = gruntOptions.appId;
    tizenCLIPath = gruntOptions.tizenCLIPath;
    tizenScriptPath = gruntOptions.tizenScriptPath;
    tvPath = gruntOptions.tvPath;
    tvIP = gruntOptions.tvIP;
    profileName = gruntOptions.profileName;
    profilePath = gruntOptions.profilePath;
  }

  grunt.initConfig({
    shell: {
      createWgt: {
        command: [
          `${tizenCLIPath + tizenScriptPath} build-web -- ./${distPath}`,
          `${tizenCLIPath + tizenScriptPath} package --sign ${profileName} --type wgt -- ./${distPath}.buildResult`,
          `mv ./${distPath}.buildResult/${appName}.wgt ./${distPath}`
        ].join("&&")
      },
      deployToTizen: {
        command: [
          `${tizenCLIPath}/tools/sdb disconnect`,
          `${tizenCLIPath}/tools/sdb connect ${tvIP}`,
          `${tizenCLIPath}/tools/sdb -e shell pkgcmd -u -n ${appId}`,
          `${tizenCLIPath}/tools/sdb install ${__dirname}/${distPath + appName}.wgt`,
          `${tizenCLIPath}/tools/sdb -e shell app_launcher -w -s ${appId}.${appName}`
        ].join("&&"),
        options: {
          callback: findDevToolsPort
        }
      },
      runDevTools: {
        command: () => `google-chrome ${devToolsAdress}`
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
        command: `${tizenCLIPath +
          tizenScriptPath} cli-config -g profiles.path=${profilePath}`
      }
    },
    webpack: {
      debug: require("./webpack.config.js")
    }
  });

  grunt.registerTask("wgt-deploy", [
    "shell:createWgt",
    "shell:deployToTizen",
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

// const schedule = require("node-cron");
const schedule = require("node-schedule");
const { queryDb } = require("../helper/adminHelper");
const soment = require("moment-timezone");

exports.timeToSend = (io) => {
  const job = schedule.scheduleJob("* * * * * *", function () {
    const now = new Date();
    const nowIST = soment(now).tz("Asia/Kolkata");

    const currentMinute = nowIST.minutes();
    const currentSecond = nowIST.seconds();
    io.emit("seconds", `${currentMinute}_${currentSecond}`);
  });
};

exports.rouletteResult = (io) => {
  let resultToBeSend = "";

  function generatedTimeEveryAfterEveryOneMinForRollet() {
    let second = 59;
    let job = schedule.scheduleJob("* * * * * *", async function () {
      io.emit("oneminrollet", second); // Emit the formatted time
      if (second === 5) {
        try {
          callAPI();
        } catch (e) {
          console.log(e);
        }
      }
      if (second === 0) {
        second = 59;
        console.log("result", resultToBeSend);
        io.emit("rolletresult", resultToBeSend);
        job?.cancel();
        job?.cancel();
        job?.cancel();
        job?.cancel();
        setTimeout(() => {
          generatedTimeEveryAfterEveryOneMinForRollet();
        }, 27000);
      } else {
        second--;
      }
    });
  }
  generatedTimeEveryAfterEveryOneMinForRollet();
  async function callAPI() {
    try {
      const query_for_call_set_result =
        "CALL generate_result_of_roulette_game(@result_msg);";
      await queryDb(query_for_call_set_result, []);
      const get_result_query = "SELECT @result_msg;";
      await queryDb(get_result_query)
        .then((result) => {
          resultToBeSend = result?.[0]?.["@result_msg"];
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }
};


           function format24(time) {
                    var hrs = Number(time.match(/^(\d+)/)[1]);
                    var mnts = Number(time.match(/:(\d+)/)[1]);
                    var format = time.match(/\s(.*)$/)[1];
                    if (format == "PM" && hrs < 12) hrs = hrs + 12;
                    if (format == "AM" && hrs == 12) hrs = hrs - 12;
                    var hours = hrs.toString();
                    var minutes = mnts.toString();
                    if (hrs < 10) hours = "0" + hours;
                    if (mnts < 10) minutes = "0" + minutes;
                    alert(hours + ":" + minutes);
                }
            function format12(time) {
                    var hrs = Number(time.match(/^(\d+)/)[1]);
                    var mnts = Number(time.match(/:(\d+)/)[1]);
                    let s;
                    if (hrs < 12) s="AM";
                    else 
                    {
                    s="PM";
                    hrs=hrs-12;
                    }
                    var hours = hrs.toString();
                    var minutes = mnts.toString();
                    if (hrs < 10) hours = "0" + hours;
                    if (mnts < 10) minutes = "0" + minutes;
                    alert(hours + ":" + minutes+s);
                }
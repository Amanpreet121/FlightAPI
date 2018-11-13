$(function () { //Document Ready function.....

    $('#search').on('click', function (e) {
        e.preventDefault();
        var src = $('#source').val();

        //console.log(src);  //Getting values from input into varables
        var dtn = $('#desti').val();
        var seatclass = $('#seatclass').val();
        var adultsno = $('#adultsno').val();

        var date = new Date($('#depdt').val()); 
        console.log(date); //Converting Date format into string to match with query string of API
        var dd = (date.getDate()).toString();     //Accessing DAy,Month Year For the dates
        var mm = (date.getMonth() + 1).toString();
        var yy = (date.getFullYear()).toString();

        var depdt = yy + mm + dd; //Got date in YYYYMMDD form
        
        //  console.log(depdt);

        // Section for Displaying Errors if any of the Input Missing
        var errmessage = "";
        var fieldmessage = "";
        if ($("#source").val() == "") {

            fieldmessage += "Source<br>";
        }
        if ($("#desti").val() == "") {

            fieldmessage += "Destination<br>";
        }
        if (fieldmessage !== "") {
            errmessage += "<p>The Folowing fields are missing:</p><br>" + fieldmessage;
        }
        if (errmessage !== "") {

            $("#errmessage").html(errmessage);
        }

        //Main Function call to get data from API with Specified Values
        getData(src, dtn, depdt, seatclass, adultsno);

    });


    function getData(src, dtn, depdt, seatclass, adultsno) {
        var url = `https://developer.goibibo.com/api/search/?app_id=458906bd&app_key=1be55b0e0a6abb21a6968f9e30a2e3e3&source=${src}&destination=${dtn}&dateofdeparture=${depdt}&seatingclass=${seatclass}&adults=${adultsno}&counter=0`;
        $.getJSON(url, function (response) {

            fetchData(response);
        });
    }

    //Adding Functionality for gettting Airport codes from the file from specified URL


    $('#source').on('change', function () {

        fetch_sourcecode();
    });
    $('#desti').on('change', function () {

        fetch_desticode();
    });


    function fetch_sourcecode() {         // Codes for Source Airport by mapping through another Json File
        var src1 = $('#source').val();
        $.getJSON("airports.json", function (responseTxt) {
            for (var i = 0; i < responseTxt.length; i++) {
                if (responseTxt[i].city.toUpperCase() === src1.toUpperCase()) {
                    $('#source').val(responseTxt[i].code);
                    return;
                }
            }
        });
    }

    function fetch_desticode() {      // Codes for Destination Airport by mapping through another Json File
        var src1 = $('#desti').val();
        $.getJSON("airports.json", function (responseTxt) {
            for (var i = 0; i < responseTxt.length; i++) {
                if (responseTxt[i].city.toUpperCase() === src1.toUpperCase()) {
                    $('#desti').val(responseTxt[i].code);
                    return;
                }
            }
        });
    }


    // Function For getting Vlues of recieved DATA
    function fetchData(response) {
        $.each(response, function (key, value) {

            var flight_data = " ";

            for (var i = 0; i < value.onwardflights.length; i++) {

                flight_data += '<tr>';
                flight_data += '<td><i class="fas fa-plane-departure" style="color: #f26722;width:10px;height:10px"></i></td>';//Displaying Flight Icon in First Col.
                flight_data += '<td><b>' + value.onwardflights[i].airline + '</b></td>';
                flight_data += '<td>' + value.onwardflights[i].deptime + '</td>';
                flight_data += '<td>' + value.onwardflights[i].arrtime + '</td>';
                flight_data += '<td>(' + value.onwardflights[i].stops + '  stop)  ' + value.onwardflights[i].splitduration + '<br><b>' + value.onwardflights[i].destination + '</b></td>';
                flight_data += '<td>' + Math.floor((value.onwardflights[i].fare.adulttotalfare) / 8.02) + '  <b>Kr</b></td>';//Converting Indian Currency int SWEDISH Krona
                // var id = value.onwardflights[i].flightcode;
                var id1 = "my_button";
                flight_data += `<td><button class=${id1}>Book</button></td>`;// Dynamically creating Id of Button for accessing particular Row
                flight_data += '</tr>';

            }

            $("#results").html(`Total Flights :${value.onwardflights.length}`);   //Total No. Of Results to be displayed
            $("#flight_body").html(flight_data);  // showing Data To the Table For Showing Values

            $(".my_button").on('click', function () { //on Clicking BookButton Msg To be Displayed Using Sweet Alert
                swal({
                    title: 'Sorry!This service not available here',
                    text: `Please go to Airline Website`,
                    type: 'error',
                    confirmButtonText: 'Ok',
                    onClose: function () {
                        return;
                    }
                })
            });


        });
    }





});
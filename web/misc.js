function processesInfo () {
    fetch('https://budynki.openstreetmap.org.pl/processes/')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
            console.log(data);
            var temp = '<table>';
            data.processes.forEach((el) => {
                temp += `<tr><td><b>Nazwa:</b></td><td><b>${el.name}</b></td>`;
                temp += `<tr><td>Czy w trakcie:</td><td>${el.in_progress}</td>`;
                temp += `<tr><td>Czas rozpoczęcia:</td><td>${el.start_time}</td>`;
                temp += `<tr><td>Czas zakończenia:</td><td>${el.end_time}</td>`;
                if (el.no_of_tiles_to_process >= 0) {
                    temp += `<tr><td>Kafle pozostałe do przetworzenia:</td><td>${el.no_of_tiles_to_process}</td>`;
                }
            });
            temp += '</table>';
            $('#procinfo').html(temp);
    });
}

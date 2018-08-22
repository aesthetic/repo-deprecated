var expenses = [
  //{ price: 1000, itemName: 'Eggs', date: '07/23/09', cat: 'Activity'},
	  {price: 37.98, itemName: 'Cornhole Bean Bags', date: '08/22/18', cat:'General'},
];


var classDonation = 2019;







//Credit to Onur Yıldırım on StackOverflow
var dynamicTable = (function() {

  var _tableId, _table,
    _fields, _headers,
    _defaultText;

  /** Builds the row with columns from the specified names.
   *  If the item parameter is specified, the memebers of the names array will be used as property names of the item; otherwise they will be directly parsed as text.
   */
  function _buildRowColumns(names, item) {
    var row = '<tr>';
    if (names && names.length > 0) {
      $.each(names, function(index, name) {
        var c = item ? item[name + ''] : name;
        row += '<td>' + c + '</td>';
      });
    }
    row += '</tr>';
    return row;
  }

  /** Builds and sets the headers of the table. */
  function _setHeaders() {
    // if no headers specified, we will use the fields as headers.
    _headers = (_headers == null || _headers.length < 1) ? _fields : _headers;
    var h = _buildRowColumns(_headers);
    if (_table.children('thead').length < 1) _table.prepend('<thead></thead>');
    _table.children('thead').html(h);
  }

  function _setNoItemsInfo() {
    if (_table.length < 1) return; //not configured.
    var colspan = _headers != null && _headers.length > 0 ?
      'colspan="' + _headers.length + '"' : '';
    var content = '<tr class="no-items"><td ' + colspan + ' style="text-align:center">' +
      _defaultText + '</td></tr>';
    if (_table.children('tbody').length > 0)
      _table.children('tbody').html(content);
    else _table.append('<tbody>' + content + '</tbody>');
  }

  function _removeNoItemsInfo() {
    var c = _table.children('tbody').children('tr');
    if (c.length == 1 && c.hasClass('no-items')) _table.children('tbody').empty();
  }

  return {
    /** Configres the dynamic table. */
    config: function(tableId, fields, headers, defaultText) {
      _tableId = tableId;
      _table = $('#' + tableId);
      _fields = fields || null;
      _headers = headers || null;
      _defaultText = defaultText || 'No items to list...';
      _setHeaders();
      _setNoItemsInfo();
      return this;
    },
    /** Loads the specified data to the table body. */
    load: function(data, append) {
      if (_table.length < 1) return; //not configured.
      _setHeaders();
      _removeNoItemsInfo();
      if (data && data.length > 0) {
        var rows = '';
        $.each(data, function(index, item) {
          rows += _buildRowColumns(_fields, item);
        });
        var mthd = append ? 'append' : 'html';
        _table.children('tbody')[mthd](rows);
      } else {
        _setNoItemsInfo();
      }
      return this;
    },
    /** Clears the table body. */
    clear: function() {
      _setNoItemsInfo();
      return this;
    }
  };
}());

$(document).ready(function(e) {

  var dt = dynamicTable.config('expense-table', ['itemName', 'price', 'date', 'cat'], ['Item', 'Price', 'Date', 'Type'], //set to null for field names instead of custom header names
    'There have been no expenses...');
  dt.load(expenses);
});

var motLabels = ["05/24/18"]
var motData = [5053.66]

var generalExpenses = 0;
var activityExpenses = 0;

for(var i = 0; i < expenses.length; i++){
  motLabels.push(expenses[i]['date']);
  motData.push(motData[i]-expenses[i]['price']);
  if(expenses[i]['cat'].toLowerCase() == 'general'){
	  generalExpenses += expenses[i]['price']
  }
  if(expenses[i]['cat'].toLowerCase() == 'activity'){
	  activityExpenses += expenses[i]['price']
  }
}
var totalMoney = motData[motData.length-1]
document.getElementById('total').innerHTML = '$'+ totalMoney;








var spendableCash = 5053.66 - classDonation;
var generalMoney = spendableCash * .40 - generalExpenses;
var activityMoney = spendableCash * .60 - activityExpenses;

var tmLabels = ["Class Activities", "General Expenses", "End of Year Donation"];
var tmData = [activityMoney.toFixed(2), generalMoney.toFixed(2), classDonation.toFixed(2)];
var breakdownPieCanvas = document.getElementById("breakdownPie").getContext('2d');
var breakdownPie = new Chart(breakdownPieCanvas, {
  type: 'pie',
  data: {
    labels: tmLabels,
    datasets: [{
      data: tmData,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderColor: 'rgba(0,0,0, .2)',
      borderWidth: 0
    }]
  }
});



var ctx = document.getElementById("moneyOverTime").getContext('2d');
var moneyOverTime = new Chart(ctx, {
  type: 'line',
  data: {
    labels: motLabels,
    datasets: [{
      label: 'Dollars Available',
      data: motData,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 90, 100, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
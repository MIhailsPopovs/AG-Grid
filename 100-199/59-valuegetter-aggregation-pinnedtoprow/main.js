var columnDefs = [
    { headerName: 'Type', field: 'type', rowGroup: true, hide: true },
    { headerName: "A", field: 'a' },
    { headerName: "B", field: 'b' },
    {
        headerName: "A + B", colId: 'a&b',
        valueGetter: params => {
            if (params.node.group) {
                return null
            }
            return params.data.a + params.data.b
        }
    }
];

function createRowData() {
    var rowData = [];
    for (var i = 0; i < 10; i++) {
        let rand = Math.random();
        rowData.push({
            type: rand < 0.25 ? 'A' : rand < 0.5 ? 'B' : rand < 0.75 ? 'C' : 'D',
            a: i,
            b: 2 * i
        });
    }
    return rowData;
}

function getPinnedTopRowData() {
    return [{
        type: null,
        a: null,
        b: null
    }]
}


var gridOptions = {
    defaultColDef: {
        aggFunc: 'sum',
        pinnedRowCellRenderer: 'myPinnedRowCellRenderer'
    },
    groupDefaultExpanded: -1,
    columnDefs: columnDefs,
    rowData: createRowData(),
    pinnedTopRowData: getPinnedTopRowData(),
    getRowStyle: function (params) {
        if (params.node.rowPinned) {
            return { backgroundColor: 'deepskyblue', fontWeight: 'bold' };
        }
        if (params.node.group) {
            return { backgroundColor: 'lightskyblue', fontWeight: 'bold' }
        }
        return { backgroundColor: 'aliceblue' }
    },
    onFirstDataRendered: function (params) {
        params.api.sizeColumnsToFit();
    },
    components: {
        myPinnedRowCellRenderer: MyPinnedRowCellRenderer
    },
    suppressAggFuncInHeader: true
};

function MyPinnedRowCellRenderer() { }

MyPinnedRowCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    if (params.column.colId === 'ag-Grid-AutoColumn') {
        this.eGui.innerHTML = 'Total';
        return;
    }
    var total = 0;
    params.api.forEachNode(node => {
        if (node.group) {
            total += node.aggData[params.column.colId]
        }
    })
    this.eGui.textContent = total;

}

MyPinnedRowCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

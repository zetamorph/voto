import {Pie} from 'vue-chartjs';

export default Pie.extend({
  props: {
    pollData: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: []
          }
        ]
      }
    }
  },
  updated : function() {
      this.makeChartData();
      this.renderChart(this.chartData);
  },
  methods: {
    makeChartData: function() {
      for(var i=0; i<this.pollData.options.length; i++) {
        this.chartData.labels[i] = this.pollData.options[i].title;
        this.chartData.datasets[0].data[i] = this.pollData.options[i].voteCount;
        let colorString = this.makeColorString();
        this.chartData.datasets[0].backgroundColor[i] = colorString;
        this.chartData.datasets[0].borderColor[i] = colorString;

      }
    },
    makeColorString: function() {
      return "rgba(" + this.makeRandomColor() + "," + this.makeRandomColor() + "," + this.makeRandomColor() + ",1)";
    },
    makeRandomColor: function() {
      return Math.floor(Math.random()*255);
    }
  }
})

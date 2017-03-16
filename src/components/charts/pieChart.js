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
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
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
      }
    }
  }
})

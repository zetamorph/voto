import {Doughnut, mixins} from 'vue-chartjs/es';

export default Doughnut.extend({
  props: ['chartObj'],
  mounted() {
    this.renderChart(this.chartData.data, this.chartData.options);
  },
  updated: function() {
    this.renderChart(this.chartData.data, this.chartData.options);
  },
  computed: {
    chartData: function () {
      return this.chartObj;
    }
  }
})
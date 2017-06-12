import { Doughnut } from "vue-chartjs/es";

export default Doughnut.extend({
  props: ["chartObj"],
  mounted() {
    this.renderChart(this.chartData.data, this.chartData.options);
  },
  updated() {
    this._chart.destroy();
    this.renderChart(this.chartData.data, this.chartData.options);
  },
  watch: {
    chartData() {
      this._chart.destroy();
      this.renderChart(this.chartData.data, this.chartData.options);
    },
  },
  computed: {
    chartData() {
      return this.chartObj;
    },
  },
});

import {Pie, mixins} from 'vue-chartjs/es';

export default Pie.extend({
  props: ['chartObj'],
  mounted() {
    this.renderChart(this.chart.data, this.chart.options);
  },
  computed: {
    chart: function () {
      return this.chartObj;
    }
  }
})
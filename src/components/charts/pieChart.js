import {Pie, mixins} from 'vue-chartjs/es';

export default Pie.extend({

  mixins: [mixins.reactiveProp],
  props: ['options'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
})
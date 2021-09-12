<script>
// CommitChart.js
import { Line } from "vue-chartjs";

export default {
  props: ['labels', 'datasets'],
  extends: Line,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
    });
  },
};
</script>
<script>
// CommitChart.js
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["labels", "datasets"],
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets,
    });
  },
};
</script>
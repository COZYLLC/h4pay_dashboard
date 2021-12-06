<template>
  <div>
    <p class="title is-4">무승인 상품권 대량 선물</p>
    <p class="subtitle is-6">
      금액 상품권을 학생들에게 결제하지 않고 대량으로 선물할 수 있습니다.
    </p>
    <BulkForm />
  </div>
</template>

<script>
import BulkForm from "@/views/Voucher/BulkForm.vue";
export default {
  components: {
    BulkForm,
  },
};
</script>

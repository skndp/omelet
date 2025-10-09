<template>
  <div id="page-to-page-loader">
    <div id="spinner" />
  </div>
</template>

<style lang='scss'>
#page-to-page-loader {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba($white, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 333;

  #spinner {
    position: relative;
    width: $space-l;
    height: $space-l;
    border-radius: 50%;
    display: flex;
    animation: spinner 1s linear infinite;

    &:before {
      content: '';
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      border: 4px solid $black;
      border-right: 4px solid transparent;
      border-radius: 50%;
    }
  }

  &.p2p-loading-enter-active,
  &.p2p-loading-leave-active {
    transition: opacity $speed-666 $evil-ease;
  }

  &.p2p-loading-enter-from,
  &.p2p-loading-leave-to {
    opacity: 0;
  }
}
</style>

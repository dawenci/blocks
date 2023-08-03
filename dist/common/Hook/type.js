export var HookType;
(function (HookType) {
    HookType[HookType["Connected"] = 0] = "Connected";
    HookType[HookType["Disconnected"] = 1] = "Disconnected";
    HookType[HookType["Adopted"] = 2] = "Adopted";
    HookType[HookType["AttributeChanged"] = 3] = "AttributeChanged";
    HookType[HookType["Render"] = 4] = "Render";
})(HookType || (HookType = {}));

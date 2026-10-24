/**
 * Standard Indian Vehicle Registration Number regex
 *
 * Supported formats:
 * - Standard State/UT format:
 *   - WB-01-AB-1234, WB 01 AB 1234, WB01AB1234
 *   - WB-19-A-1234, WB19A1234
 *   - WB-24-1234, WB241234
 *   - DL 1C AA 1111, DL-01-AA-1111 (Delhi format)
 * - Bharat (BH) series format:
 *   - 22BH1234AA, 22 BH 1234 AA, 22-BH-1234-AA
 * - Other states: MH-12-DE-1433, KA-05-MJ-5005, etc.
 */
export const VEHICLE_NO_REGEX =
  /^([A-Z]{2}[ -]?[0-9]{1,2}(?:[ -]?[A-Z]{1,3})?[ -]?[0-9]{4}|[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}|[0-9]{2}[ -]?BH[ -]?[0-9]{4}[ -]?[A-Z]{1,2})$/i;

/**
 * Validates vehicle number format
 * @param {string} value
 * @returns {true | string} returns true if valid, or error message string if invalid
 */
export const validateVehicleNumber = (value) => {
  if (!value || typeof value !== "string" || !value.trim()) {
    return "Vehicle Number is required";
  }

  const trimmed = value.trim();

  if (!VEHICLE_NO_REGEX.test(trimmed)) {
    return "Invalid vehicle number. Format: WB-01-AB-1234 or WB01AB1234";
  }

  return true;
};

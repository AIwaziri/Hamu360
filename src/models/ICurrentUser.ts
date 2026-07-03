/**
 * Cross-cutting identity model — every feature that needs "who is logged in"
 * depends on this shape, so it lives here rather than inside any one
 * feature's folder.
 */
export interface ICurrentUser {
  id: string;
  displayName: string;
  email: string;
  loginName: string;
}

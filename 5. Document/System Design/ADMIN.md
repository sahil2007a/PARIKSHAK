# PARISHAK Admin & Compliance Platform
### "Practice. Prove. Protect."

---

## 1. Role-Based Access Control (RBAC)

The backend enforces strict permission tiers:

| Role | Permissions |
|:---|:---|
| `WORKER` | Access own training, assessments, offline sync, certificates, and profile. Prohibited from all `/api/v1/admin/*` routes (`403 FORBIDDEN`). |
| `SUPERVISOR` | View plant worker progress and field verification. |
| `ADMIN` / `ORG_ADMIN` | Full access to compliance dashboard, worker directory, module authoring, certificate lifecycle management, and revocation. |
| `SUPER_ADMIN` | Multi-tenant organization oversight and immutable audit log review. |

---

## 2. Admin Dashboard Live Features

1. **Compliance Overview**:
   - Total Workers, Active Workers, Certified Workers count.
   - Compliance Percentage ($(\text{Certified} / \text{Total}) \times 100$).
   - Expiring (within 30 days) and Expired certificate alerts.

2. **Worker Management**:
   - Search by Name, Worker ID, Phone, or Email.
   - Filter by Sector (`MINING`, `STEEL`, `MICA`, `CONSTRUCTION`, `MANUFACTURING`, `GENERAL`).
   - Account Actions: Suspend worker (blocks login) / Reactivate worker.

3. **Certificate Revocation**:
   - Search by Certificate Number or Worker.
   - Cryptographic revocation with mandatory audit rationale.

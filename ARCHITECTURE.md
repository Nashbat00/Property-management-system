# HomeLink - Software Architecture Document

---

## Title Page

| | |
|---|---|
| **Project Name** | HomeLink - Property Management System |
| **Document Title** | Software Architecture Document (SAD) |
| **Version** | 1.0 |
| **Date** | April 2026 |
| **Course** | SWE332 - Software Architecture |
| **Architecture Model** | 4+1 View Model (Kruchten, 1995) |

### Team Members

| Name | Student ID | Responsibility |
|------|-----------|----------------|
| Bager Diren Karakoyun | 210513250 | Project Lead, README, Sections 1-3, Section 9 (Scenarios) |
| Abdalrahman Mazen Ahmad Nashbat | 230513079 | Section 5 - Logical View (Class Diagram) |
| Deo Gratias Kipioka Mutipula | 220513571 | Section 6 - Process View (Sequence + Activity Diagrams) |
| Maryama Said Mohamoud | 210513248 | Sections 7-8 - Development + Physical Views |
| Alawi Khaled Alhamed | 230513621 | Section 4 (Goals), Sections 10-11 (Size/Performance, Quality), Appendices |

---

## Change History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.1 | 2026-04-05 | Bager Diren Karakoyun | Initial document structure, Title Page, TOC, List of Figures |
| 0.2 | 2026-04-05 | Bager Diren Karakoyun | Added Scope, References, Software Architecture overview |
| 0.3 | 2026-04-06 | Bager Diren Karakoyun | Added Scenarios section with Use Case Diagram and 5 use cases |

---

## Table of Contents

1. [Scope](#1-scope)
2. [References](#2-references)
3. [Software Architecture](#3-software-architecture)
4. [Architectural Goals and Constraints](#4-architectural-goals-and-constraints)
5. [Logical View](#5-logical-view)
6. [Process View](#6-process-view)
7. [Development View](#7-development-view)
8. [Physical View](#8-physical-view)
9. [Scenarios](#9-scenarios)
10. [Size and Performance](#10-size-and-performance)
11. [Quality](#11-quality)
12. [Appendices](#12-appendices)

---

## List of Figures

| Figure # | Title | Section |
|----------|-------|---------|
| Figure 9.1 | Use Case Diagram | Section 9.1 |
| Figure 5.1 | Class Diagram | Section 5.2 |
| Figure 6.1 | Sequence Diagram - User Login | Section 6.2 |
| Figure 6.2 | Sequence Diagram - Add Dues | Section 6.3 |
| Figure 6.3 | Sequence Diagram - Maintenance Request | Section 6.4 |
| Figure 6.4 | Activity Diagram - Payment Flow | Section 6.5 |
| Figure 7.1 | Component Diagram | Section 7.3 |
| Figure 8.1 | Deployment Diagram | Section 8.1 |

---

## 1. Scope

### 1.1 Project Description

HomeLink is a web-based property management system designed to digitize and streamline the administrative operations of residential buildings. The platform serves as a bridge between building managers and residents, providing tools for managing monthly dues, tracking payments, handling maintenance requests, and broadcasting announcements. By replacing traditional paper-based or informal communication methods, HomeLink aims to improve transparency, efficiency, and accountability in building management.

### 1.2 Document Purpose

This Software Architecture Document (SAD) describes the architecture of the HomeLink system using the **4+1 View Model** introduced by Philippe Kruchten (1995). The 4+1 model organizes the architecture into five concurrent views, each addressing a specific set of concerns:

- **Logical View** - The object-oriented decomposition of the system into key abstractions (classes and entities)
- **Process View** - The system's concurrency, synchronization, and runtime behavior
- **Development View** - The organization of the software modules, packages, and layers
- **Physical View** - The mapping of software components to hardware and cloud infrastructure
- **Scenarios (+1)** - Use cases that validate and illustrate the architecture

### 1.3 Target Audience

This document is intended for:

- **Developers** working on the HomeLink codebase who need to understand the system structure
- **Stakeholders** evaluating the technical approach and architectural decisions
- **Course Instructors** assessing the quality and completeness of the architectural documentation
- **Maintainers** who will extend or modify the system in the future

---

## 2. References

The following references were used in the preparation of this document and the development of the HomeLink system:

| # | Reference |
|---|-----------|
| 1 | Kruchten, P.B. (1995). "The 4+1 View Model of Architecture." *IEEE Software*, 12(6), pp. 42-50. |
| 2 | React Documentation - [https://react.dev/](https://react.dev/) |
| 3 | Supabase Documentation - [https://supabase.com/docs](https://supabase.com/docs) |
| 4 | Tailwind CSS Documentation - [https://tailwindcss.com/docs](https://tailwindcss.com/docs) |
| 5 | Vercel Documentation - [https://vercel.com/docs](https://vercel.com/docs) |

---

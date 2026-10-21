export const az900Topics = [
  { id: 'cloud-concepts', label: 'Describe cloud concepts' },
  { id: 'azure-services', label: 'Describe Azure architecture and services' },
  { id: 'management-governance', label: 'Describe Azure management and governance' },
]

// Original practice questions mapped to Microsoft's published AZ-900 skill areas.
export const az900Questions = [
  {
    id: 'saas-responsibility',
    topicId: 'cloud-concepts',
    question: 'A school in Lusaka uses a browser-based email service hosted by a cloud provider. Which responsibility still belongs to the school?',
    options: [
      'Protecting its users’ sign-in details and deciding who can access its data',
      'Maintaining the provider’s physical servers',
      'Replacing the provider’s network switches',
      'Patching the provider’s email application code',
    ],
    answerIndex: 0,
    correctExplanation: 'With a software-as-a-service (SaaS) product, the provider manages the application and underlying infrastructure. The customer still manages its users, access, and data.',
    incorrectExplanation: 'The other choices describe the provider’s application or infrastructure responsibilities. The school still needs to manage its own users, access, and data.',
    example: 'Think of a school using a managed online noticeboard: the provider runs the service, while the school decides which staff can post private notices.',
  },
  {
    id: 'hybrid-cloud',
    topicId: 'cloud-concepts',
    question: 'A clinic keeps one workload in its own private environment and uses a public cloud service for another. Which cloud model describes this arrangement?',
    options: ['Public cloud', 'Private cloud', 'Hybrid cloud', 'A single-region cloud'],
    answerIndex: 2,
    correctExplanation: 'A hybrid cloud combines private and public cloud environments. The arrangement in the question uses both.',
    incorrectExplanation: 'Public-only and private-only describe one environment, not a combination. A region is a geographic Azure concept, not a cloud deployment model.',
    example: 'A community clinic could keep a sensitive system in its own environment while using a public cloud service for a separate public information site.',
  },
  {
    id: 'resource-group',
    topicId: 'azure-services',
    question: 'A project team wants to organize related Azure resources, such as an app and its supporting storage, into one logical container. What should it use?',
    options: ['An Azure region', 'A resource group', 'A virtual network', 'A user account'],
    answerIndex: 1,
    correctExplanation: 'An Azure resource group is a logical container for related resources that are managed together.',
    incorrectExplanation: 'A region is a location, a virtual network provides network connectivity, and a user account represents an identity. None is the logical resource container.',
    example: 'Like grouping a school project’s documents in one clearly named folder, a resource group helps organize related Azure resources.',
  },
  {
    id: 'virtual-machine',
    topicId: 'azure-services',
    question: 'A developer needs a cloud computer and wants control over the operating system installed on it. Which Azure service type is the best fit?',
    options: ['Azure virtual machine', 'Azure Policy', 'Azure role assignment', 'Azure region'],
    answerIndex: 0,
    correctExplanation: 'An Azure virtual machine provides compute in a virtualized server, with control over its guest operating system.',
    incorrectExplanation: 'The other choices are for governance, access control, or location. They do not provide a virtual computer with an operating system.',
    example: 'It is similar to renting a computer for a project: the provider runs the physical equipment, while you configure the virtual computer.',
  },
  {
    id: 'rbac-reader',
    topicId: 'management-governance',
    question: 'A teammate should be able to view a resource group but not change its resources. Which access approach best matches this need?',
    options: [
      'Assign the Reader role at the resource-group scope',
      'Give the teammate the account password of an administrator',
      'Create an Azure region for the teammate',
      'Apply a naming policy that grants full access',
    ],
    answerIndex: 0,
    correctExplanation: 'Azure role-based access control (RBAC) assigns permissions through roles at a scope. The Reader role is intended for viewing without making changes.',
    incorrectExplanation: 'Sharing an administrator password is unsafe and grants excessive access. Regions and naming policies do not grant read permissions.',
    example: 'This is like giving a classmate permission to view a shared timetable without letting them edit it.',
  },
  {
    id: 'azure-policy',
    topicId: 'management-governance',
    question: 'An organization wants to check whether its Azure resources follow a rule, such as requiring a particular configuration. Which service is designed for this governance task?',
    options: ['Azure Policy', 'Azure virtual machines', 'Azure Storage', 'Azure regions'],
    answerIndex: 0,
    correctExplanation: 'Azure Policy helps assess and enforce organizational standards for resources.',
    incorrectExplanation: 'Virtual machines provide compute, Storage holds data, and regions describe locations. Azure Policy is the governance service for checking resource standards.',
    example: 'A school can use a checklist to check whether every class has handed in a form. Azure Policy provides a way to check resource configurations against rules.',
  },
]

export const az900Flashcards = [
  {
    id: 'public-cloud',
    term: 'Public cloud',
    definition: 'Cloud services made available over the internet by a provider, using infrastructure the provider operates.',
    example: 'A school uses an online service instead of running the service’s servers in its own computer room.',
  },
  {
    id: 'private-cloud',
    term: 'Private cloud',
    definition: 'A cloud environment dedicated to one organization.',
    example: 'An organization uses a cloud environment reserved for its own workloads and requirements.',
  },
  {
    id: 'hybrid-cloud-card',
    term: 'Hybrid cloud',
    definition: 'A combination of private and public cloud environments.',
    example: 'A clinic keeps one system in a private environment and uses a public cloud service for another.',
  },
  {
    id: 'saas',
    term: 'SaaS',
    definition: 'Software as a service: a provider delivers a ready-to-use application, usually over the internet.',
    example: 'Learners use a browser-based classroom application while the provider operates the application.',
  },
  {
    id: 'iaas',
    term: 'IaaS',
    definition: 'Infrastructure as a service: cloud infrastructure such as virtual machines is provided, while the customer manages more of the software stack.',
    example: 'A developer rents a virtual computer and configures its operating system for an app.',
  },
  {
    id: 'azure-region',
    term: 'Azure region',
    definition: 'A geographic area that contains Azure datacenters.',
    example: 'When planning a deployment, a team considers which Azure region meets its location and service needs.',
  },
  {
    id: 'rbac',
    term: 'Azure RBAC',
    definition: 'Role-based access control grants permissions through role assignments at a chosen scope.',
    example: 'A learner gets permission to view a class resource without permission to change it.',
  },
  {
    id: 'azure-policy-card',
    term: 'Azure Policy',
    definition: 'A governance service for creating, assigning, and managing rules for Azure resources.',
    example: 'An organization checks that resources follow its configuration standards.',
  },
]

export const az900SkillsOutlineUrl =
  'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900'

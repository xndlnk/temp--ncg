class Command {
  public contextName: string;

  public aggregateName: string;

  public aggregateId: string;

  public name: string;

  public data: object;

  public constructor (
    contextName: string,
    aggregateName: string,
    aggregateId: string,
    name: string,
    data: object
  ) {
    this.contextName = contextName;
    this.aggregateName = aggregateName;
    this.aggregateId = aggregateId;
    this.name = name;
    this.data = data;
  }
}

export { Command };

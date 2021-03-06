
<%@ page import="yourBook.Member" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'member.label', default: 'Member')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
        <style>
            #borrow{
                padding: 15px;
            }
        </style>
	</head>
	<body>
    <br>
    <div class="ui red segment" style="width: 90%;margin: 0px auto">
        <div id="show-member" class="content scaffold-show" role="main">
			<h1 style="text-align: center"><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
                <div class="ui center aligned segment">
                    <div class="ui positive message">
                        <div class="header">
                            <h1 style="text-align: center">${flash.message}</h1>
                        </div>
                    </div>
                </div>
            </g:if>
            </div>
                <div class="ui green segment">
				<g:if test="${memberInstance?.rollNumber}">
					<span id="rollNumber-label" class="property-label"><g:message code="member.rollNumber.label" default="Roll Number" />: </span>
					
						<span class="property-value" aria-labelledby="rollNumber-label"><g:fieldValue bean="${memberInstance}" field="rollNumber"/></span>
					
				</g:if>
			</div>
                <div class="ui blue segment">

                    <g:if test="${memberInstance?.firstName}">
					<span id="firstName-label" class="property-label"><g:message code="member.firstName.label" default="First Name" />: </span>
					
						<span class="property-value" aria-labelledby="firstName-label"><g:fieldValue bean="${memberInstance}" field="firstName"/></span>
					
				</g:if>
			</div>
                <div class="ui yellow segment">

                    <g:if test="${memberInstance?.lastName}">
					<span id="lastName-label" class="property-label"><g:message code="member.lastName.label" default="Last Name" />: </span>
					
						<span class="property-value" aria-labelledby="lastName-label"><g:fieldValue bean="${memberInstance}" field="lastName"/></span>
									</g:if>
			</div>
                <div class="ui orange segment">

                    <g:if test="${memberInstance?.gender}">
					<span id="gender-label" class="property-label"><g:message code="member.gender.label" default="Gender" />: </span>
					
						<span class="property-value" aria-labelledby="gender-label"><g:fieldValue bean="${memberInstance}" field="gender"/></span>
					
				</g:if>
			</div>
                <div class="ui white segment">

                    <g:if test="${memberInstance?.address}">
					<span id="address-label" class="property-label"><g:message code="member.address.label" default="Address" />: </span>
					
						<span class="property-value" aria-labelledby="address-label"><g:fieldValue bean="${memberInstance}" field="address"/></span>
									</g:if>
			</div>

                <div class="ui black segment">

                    <g:if test="${memberInstance?.contact}">
					<span id="contact-label" class="property-label"><g:message code="member.contact.label" default="Contact" />: </span>
					
						<span class="property-value" aria-labelledby="contact-label"><g:fieldValue bean="${memberInstance}" field="contact"/></span>
									</g:if>
			</div>

                <div class="ui purple segment">

                    <g:if test="${memberInstance?.batch}">
					<span id="batch-label" class="property-label"><g:message code="member.batch.label" default="Batch" />: </span>
					
						<span class="property-value" aria-labelledby="batch-label"><g:fieldValue bean="${memberInstance}" field="batch"/></span>
									</g:if>
			</div>

                <div class="ui violet segment">

                    <g:if test="${memberInstance?.email}">
					<span id="email-label" class="property-label"><g:message code="member.email.label" default="Email" />: </span>
					
						<span class="property-value" aria-labelledby="email-label"><g:fieldValue bean="${memberInstance}" field="email"/></span>
					
				</g:if>
			</div>

                <div class="ui pink segment">

                    <g:if test="${memberInstance?.type}">
					<span id="type-label" class="property-label"><g:message code="member.type.label" default="Type" />:</span>
					
						<span class="property-value" aria-labelledby="type-label"><g:link controller="type" action="show" id="${memberInstance?.type?.id}">${memberInstance?.type?.encodeAsHTML()}</g:link></span>
					
				</g:if>
			</div>
                <div class="ui red segment">

                    <g:if test="${memberInstance?.user}">
					<span id="user-label" class="property-label"><g:message code="member.user.label" default="User" />: </span>
					
						<span class="property-value" aria-labelledby="user-label"><g:link controller="user" action="show" id="${memberInstance?.user?.id}">${memberInstance?.user?.encodeAsHTML()}</g:link></span>
									</g:if>
			
            </div>
        <div class="ui green segment">

            <g:if test="${memberInstance?.borrow}">
               <b> <th style="text-align: center"> Book Borrowed by ${memberInstance?.firstName}: </th></b>

                <g:each in="${memberInstance.borrow}" var="b">
                    <span class="property-value" aria-labelledby="borrow-label">${b?.encodeAsHTML()},</span>
                </g:each>        </g:if>
        </div>


			<g:form url="[resource:memberInstance, action:'delete']" method="DELETE">
                <div class="ui buttons">
                    <button class="ui button">
                        <g:link class="edit" action="edit" resource="${memberInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
                    </button>
                    <div class="or"></div>
                    <g:actionSubmit class="ui secondary button" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
                </div>
			</g:form>


    </body>
</html>
